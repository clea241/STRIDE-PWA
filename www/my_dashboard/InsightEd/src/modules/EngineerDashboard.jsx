// src/modules/EngineerDashboard.jsx

import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import { auth, db } from '../firebase'; 
import { doc, getDoc } from 'firebase/firestore';

const EngineerDashboard = () => {
    const [userName, setUserName] = useState('Engineer'); // Fallback name

    // Non-blocking data fetch
    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().firstName);
                }
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F0F0] p-5 pb-24 md:p-10 font-sans">
            
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-[#004A99] text-3xl font-bold">
                        Hello, {userName}! 👷
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here is your maintenance and engineering overview.
                    </p>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-700 mb-2">Current Projects</h3>
                    <p className="text-gray-500 text-sm">
                        No active construction projects at the moment.
                    </p>
                </div>
            </div>

            <BottomNav homeRoute="/engineer-dashboard" />
        </div>
    );
};

export default EngineerDashboard;