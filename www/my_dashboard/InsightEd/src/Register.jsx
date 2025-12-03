// src/Register.jsx

import React, { useState } from 'react';
import { auth, db, googleProvider } from './firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';

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

            alert(`Registration Successful! Redirecting you to your ${formData.role} dashboard.`);
            const path = getDashboardPath(formData.role);
            navigate(path); // <-- Uses the role to navigate
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // OPTION 2: Google Registration (with the necessary location fields added)
    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            const [firstName, ...lastNameParts] = user.displayName ? user.displayName.split(" ") : ["User", ""];
            const lastName = lastNameParts.join(" ");

            // We include all fields expected by the database, using default/empty values 
            // for location if the user didn't fill them via the form.
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                firstName: firstName,
                lastName: lastName,
                role: formData.role, // Use the role selected in the dropdown
                authProvider: "google",
                // Include location fields to prevent crashes later
                region: formData.region, 
                division: formData.division,
                district: formData.district,
                municipality: formData.municipality,
                createdAt: new Date()
            }, { merge: true }); 

            alert(`Registration Successful! Redirecting you to your ${formData.role} dashboard.`);
            const path = getDashboardPath(formData.role);
            navigate(path); // <-- Uses the role to navigate

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px' };

    return (
        <div style={{ 
            padding: '40px', 
            maxWidth: '450px', 
            margin: '50px auto',
            border: '2px solid #CC0000', // DepEd Red Border
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff'
        }}>
            <h2 style={{ color: '#004A99', textAlign: 'center' }}>InsightEd Registration</h2>
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input name="firstName" placeholder="First Name" onChange={handleChange} required style={inputStyle} />
                <input name="lastName" placeholder="Last Name" onChange={handleChange} required style={inputStyle} />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required style={inputStyle} />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={inputStyle} />
                
                {/* Location Fields */}
                <input name="region" placeholder="Region" onChange={handleChange} required style={inputStyle} />
                <input name="division" placeholder="Division" onChange={handleChange} required style={inputStyle} />
                <input name="district" placeholder="Legislative District" onChange={handleChange} required style={inputStyle} />
                <input name="municipality" placeholder="Municipality" onChange={handleChange} required style={inputStyle} />

                {/* Role Dropdown */}
                <label style={{ color: '#004A99', fontWeight: 'bold' }}>Select Role:</label>
                <select name="role" onChange={handleChange} value={formData.role} style={inputStyle}>
                    <option value="Engineer">Engineer</option>
                    <option value="School Head">School Head</option>
                    <option value="Human Resource">Human Resource</option>
                    <option value="Admin">Admin</option>
                </select>

                <button 
                    type="submit"
                    style={{ 
                        padding: '10px', 
                        backgroundColor: '#CC0000', // DepEd Red
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer' 
                    }}
                >
                    Register with Email
                </button>
            </form>

            <hr style={{ margin: '20px 0', borderTop: '1px solid #FFC400' }} /> {/* DepEd Yellow Separator */}
            
            <button 
                onClick={handleGoogleRegister} 
                style={{ 
                    padding: '10px', 
                    backgroundColor: '#4285F4', // Standard Google Blue
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '5px', 
                    width: '100%',
                    cursor: 'pointer'
                }}
            >
                Register using Google
            </button>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Already have an account? <a href="/" style={{ color: '#004A99', textDecoration: 'none' }}>Login here</a>
            </p>
        </div>
    );
};

export default Register;