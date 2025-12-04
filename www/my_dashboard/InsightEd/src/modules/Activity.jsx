// src/Activity.jsx

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';
import BottomNav from './BottomNav';

const Activity = () => {
    const [homeRoute, setHomeRoute] = useState('/');

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

    const getDashboardPath = (role) => {
        const roleMap = {
            'Engineer': '/engineer-dashboard',
            'School Head': '/schoolhead-dashboard',
            'Human Resource': '/hr-dashboard',
            'Admin': '/admin-dashboard',
        };
        return roleMap[role] || '/';
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px' }}>
            <h1>Recent Activities</h1>
            <p>Here are your latest updates and tasks.</p>
            
            {/* Dynamic Footer */}
            <BottomNav homeRoute={homeRoute} />
        </div>
    );
};

export default Activity;