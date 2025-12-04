// src/AdminDashboard.jsx

import React from 'react';
import BottomNav from './BottomNav';

const AdminDashboard = () => (
    <div className="min-h-screen bg-[#FFFBEA] p-5 pb-24 md:p-10 font-sans">
        
        <div className="max-w-4xl mx-auto">
            {/* Red Title */}
            <h1 className="text-[#CC0000] text-2xl md:text-3xl font-bold mb-3">
                👑 Welcome to the Admin Dashboard!
            </h1>
            
            {/* Standard Gray Text */}
            <p className="text-gray-700 text-base md:text-lg bg-white p-5 rounded-xl shadow-sm border border-[#f0e6d2] leading-relaxed">
                You have full access to manage users, roles, and system settings.
            </p>
        </div>

        {/* Navigation Footer */}
        <BottomNav homeRoute="/admin-dashboard" />
    </div>
);

export default AdminDashboard;