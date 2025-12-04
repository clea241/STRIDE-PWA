// src/HRDashboard.jsx

import React from 'react';
import BottomNav from './BottomNav';

const HRDashboard = () => (
    <div className="min-h-screen bg-[#F0F0F0] p-5 pb-24 md:p-10 font-sans">
        
        <div className="max-w-4xl mx-auto">
            {/* Red Title */}
            <h1 className="text-[#CC0000] text-2xl md:text-3xl font-bold mb-3">
                👩‍💼 Welcome to the Human Resource Dashboard!
            </h1>
            
            {/* Blue Description Text inside a white card */}
            <p className="text-[#004A99] text-base md:text-lg bg-white p-5 rounded-xl shadow-sm border border-gray-100 leading-relaxed">
                This is where you manage personnel records, training, and employee welfare.
            </p>
        </div>

        {/* Navigation Footer */}
        <BottomNav homeRoute="/hr-dashboard" />
    </div>
);

export default HRDashboard;