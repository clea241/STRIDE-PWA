// src/Register.jsx

import React, { useState } from 'react';
import { auth, db, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Import the new styles

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
    
    // State to hold form data
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        region: '',
        division: '',
        district: '',
        municipality: '',
        role: 'Engineer' // Default role
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // OPTION 1: Email/Password Registration
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                role: formData.role,
                region: formData.region,
                division: formData.division,
                district: formData.district,
                municipality: formData.municipality,
                createdAt: new Date()
            });

            // alert(`Registration Successful!`); // Optional
            const path = getDashboardPath(formData.role);
            navigate(path);
        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    // OPTION 2: Google Registration
    const handleGoogleRegister = async () => {
        // VALIDATION: Ensure location fields are filled before clicking Google
        if (!formData.region || !formData.division) {
            alert("Please fill in your Region and Division at the top before continuing with Google.");
            return;
        }

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Extract name from Google profile
            const [firstName, ...lastNameParts] = user.displayName ? user.displayName.split(" ") : ["User", ""];
            const lastName = lastNameParts.join(" ");

            // Save to Firestore merging Google auth with Form Location Data
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                role: formData.role, 
                authProvider: "google",
                // Essential location data from the form
                region: formData.region, 
                division: formData.division,
                district: formData.district,
                municipality: formData.municipality,
                createdAt: new Date()
            }, { merge: true }); 

            const path = getDashboardPath(formData.role);
            navigate(path);

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Join the InsightEd network</p>
                </div>

                {/* 1. SHARED FIELDS (Required for both Google and Email) */}
                <div className="input-group">
                    <label className="section-label">1. Select Your Role & Location</label>
                    
                    <select name="role" onChange={handleChange} value={formData.role} className="custom-select">
                        <option value="Engineer">Engineer</option>
                        <option value="School Head">School Head</option>
                        <option value="Human Resource">Human Resource</option>
                        <option value="Admin">Admin</option>
                    </select>

                    <div className="form-grid">
                        <input name="region" placeholder="Region" onChange={handleChange} className="custom-input" required />
                        <input name="division" placeholder="Division" onChange={handleChange} className="custom-input" required />
                    </div>
                    <div className="form-grid">
                        <input name="district" placeholder="District" onChange={handleChange} className="custom-input" />
                        <input name="municipality" placeholder="Municipality" onChange={handleChange} className="custom-input" />
                    </div>
                </div>

                {/* 2. GOOGLE SIGN UP */}
                <div className="divider">
                    <span>QUICK REGISTER</span>
                </div>

                <button onClick={handleGoogleRegister} className="btn btn-google">
                     <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.836.86-3.048.86-2.344 0-4.328-1.584-5.032-3.716H.96v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.968 10.705A5.366 5.366 0 0 1 3.682 9c0-.593.102-1.17.286-1.705V4.962H.96A9.006 9.006 0 0 0 0 9c0 1.452.348 2.827.96 4.095l3.008-2.39z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .96 4.962l3.008 2.392C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                </button>

                {/* 3. EMAIL SIGN UP */}
                <div className="divider">
                    <span>OR WITH EMAIL</span>
                </div>

                <form onSubmit={handleRegister} className="input-group">
                    <div className="form-grid">
                        <input name="firstName" placeholder="First Name" onChange={handleChange} className="custom-input" required />
                        <input name="lastName" placeholder="Last Name" onChange={handleChange} className="custom-input" required />
                    </div>
                    <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="custom-input" required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="custom-input" required />

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <Link to="/" className="link-text">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;