// src/Register.jsx

import React, { useState } from 'react';
import { auth, db, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom';


const getDashboardPath = (role) => {
    const roleMap = {
        'Engineer': '/engineer-dashboard',
        'School Head': '/schoolhead-dashboard',
        'Human Resource': '/hr-dashboard',
        'Admin': '/admin-dashboard',
    };
    return roleMap[role] || '/'; 
};

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        region: '', division: '', district: '', municipality: '',
        role: 'Engineer'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                ...formData, createdAt: new Date()
            });
            navigate(getDashboardPath(formData.role));
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        if (!formData.region || !formData.division) {
            alert("Please fill in your Region and Division at the top before continuing with Google.");
            return;
        }
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const [firstName, ...lastNameParts] = user.displayName ? user.displayName.split(" ") : ["User", ""];
            
            await setDoc(doc(db, "users", user.uid), {
                email: user.email, firstName, lastName: lastNameParts.join(" "),
                role: formData.role, authProvider: "google",
                region: formData.region, division: formData.division,
                district: formData.district, municipality: formData.municipality,
                createdAt: new Date()
            }, { merge: true }); 

            navigate(getDashboardPath(formData.role));
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center py-10 px-5 font-sans relative overflow-auto"
             style={{
                 background: 'linear-gradient(-45deg, #ffffff, #cecdd3, #004A99, #004A99)',
                 backgroundSize: '400% 400%',
                 animation: 'gradientAnimation 12s ease infinite'
             }}
        >
             <style>{`
                @keyframes gradientAnimation {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>

            <div className="bg-white/95 backdrop-blur-md w-full max-w-[500px] p-8 rounded-[20px] shadow-2xl relative z-10">
                <div className="text-center mb-6">
                    <h2 className="text-[#004A99] text-3xl font-bold m-0">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join the InsightEd network</p>
                </div>

                {/* 1. SHARED FIELDS */}
                <div className="flex flex-col gap-4 mb-6">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">1. Select Role & Location</label>
                    
                    <select name="role" onChange={handleChange} value={formData.role} 
                            className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white focus:border-[#004A99] outline-none transition-colors">
                        <option value="Engineer">Engineer</option>
                        <option value="School Head">School Head</option>
                        <option value="Human Resource">Human Resource</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                        <input name="region" placeholder="Region" onChange={handleChange} required 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                        <input name="division" placeholder="Division" onChange={handleChange} required 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <input name="district" placeholder="District" onChange={handleChange} 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                        <input name="municipality" placeholder="Municipality" onChange={handleChange} 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                    </div>
                </div>

                {/* 2. GOOGLE BUTTON */}
                <div className="flex items-center text-gray-400 text-sm my-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3">QUICK REGISTER</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <button onClick={handleGoogleRegister} 
                        className="w-full p-3 border-2 border-gray-200 rounded-xl font-semibold flex justify-center items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 transition-colors active:scale-95">
                     <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.032-3.716H.96v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.968 10.705A5.366 5.366 0 0 1 3.682 9c0-.593.102-1.17.286-1.705V4.962H.96A9.006 9.006 0 0 0 0 9c0 1.452.348 2.827.96 4.095l3.008-2.39z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .96 4.962l3.008 2.392C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                {/* 3. EMAIL FORM */}
                <div className="flex items-center text-gray-400 text-sm my-4">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="px-3">OR WITH EMAIL</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input name="firstName" placeholder="First Name" onChange={handleChange} required 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} required 
                               className="p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                    </div>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} required 
                           className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} required 
                           className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#004A99] outline-none" />

                    <button type="submit" disabled={loading}
                            className="w-full mt-2 p-3 bg-[#004A99] text-white rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="text-center mt-6 text-sm text-gray-500">
                    Already have an account? <Link to="/" className="text-[#CC0000] font-bold hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;