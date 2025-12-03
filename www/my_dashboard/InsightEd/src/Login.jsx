// src/Login.jsx

import React, { useState } from 'react';
import { auth, googleProvider, db } from './firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const getDashboardPath = (role) => {
    const roleMap = {
        'Engineer': '/engineer-dashboard',
        'School Head': '/schoolhead-dashboard',
        'Human Resource': '/hr-dashboard',
        'Admin': '/admin-dashboard',
    };
    return roleMap[role] || '/'; // Default to login if role is unknown
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            checkUserRole(userCredential.user.uid);
        } catch (error) {
            alert(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            checkUserRole(result.user.uid);
        } catch (error) {
            alert(error.message);
        }
    };

    // Helper function to check role in Database and redirect
    const checkUserRole = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            alert(`Welcome back, ${userData.firstName}! Redirecting you to your ${userData.role} dashboard.`);
            const path = getDashboardPath(userData.role);
            navigate(path); // <-- Uses the role to navigate
        } else {
            alert("User not found in database. Please register first.");
        }
    };

    return (
        <div style={{ 
            padding: '40px', 
            maxWidth: '450px', 
            margin: '50px auto',
            border: '2px solid #004A99', // DepEd Blue Border
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff' 
        }}>
            <h2 style={{ color: '#CC0000', textAlign: 'center' }}>InsightEd Login</h2>
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                />
                <button 
                    type="submit"
                    style={{ 
                        padding: '10px', 
                        backgroundColor: '#004A99', // DepEd Blue
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '5px',
                        cursor: 'pointer' 
                    }}
                >
                    Login
                </button>
            </form>
            
            <hr style={{ margin: '20px 0', borderTop: '1px solid #FFC400' }} /> {/* DepEd Yellow Separator */}
            
            <button 
                onClick={handleGoogleLogin} 
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
                Login with Google
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
                Don't have an account? <a href="/register" style={{ color: '#CC0000', textDecoration: 'none' }}>Register here</a>
            </p>
        </div>
    );
};

export default Login;