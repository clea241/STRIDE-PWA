// src/UserProfile.jsx (or wherever this file is located)

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // <--- Ensure this path is correct
import { doc, getDoc } from 'firebase/firestore';
import BottomNav from './BottomNav'; // <--- Import the Nav

const UserProfile = () => {
    const navigate = useNavigate();
    const [homeRoute, setHomeRoute] = useState('/'); // Default to login if unknown

    // 1. Fetch User Role on Load
    useEffect(() => {
        const fetchUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setHomeRoute(getDashboardPath(userData.role));
                }
            }
        };
        fetchUserRole();
    }, []);

    // Helper Function to map Role -> Path
    const getDashboardPath = (role) => {
        const roleMap = {
            'Engineer': '/engineer-dashboard',
            'School Head': '/schoolhead-dashboard',
            'Human Resource': '/hr-dashboard',
            'Admin': '/admin-dashboard',
        };
        return roleMap[role] || '/';
    };

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px' }}>
            <h1>User Profile</h1>
            <p>Manage your account settings here.</p>
            
            <button 
                onClick={handleLogout} 
                style={{ 
                    backgroundColor: '#CC0000', 
                    color: 'white', 
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '20px',
                    cursor: 'pointer'
                }}
            >
                Logout
            </button>
            
            {/* 2. Pass the dynamic homeRoute to the Nav */}
            <BottomNav homeRoute={homeRoute} />
        </div>
    );
};

export default UserProfile;