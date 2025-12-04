// src/EngineerDashboard.jsx

import React from 'react';
import BottomNav from './BottomNav';

const EngineerDashboard = () => (
    <div className="min-h-screen bg-[#F0F0F0] p-5 pb-24 md:p-10 font-sans">
        
        {/* Header Section */}
        <div className="max-w-4xl mx-auto">
            <h1 className="text-[#004A99] text-2xl md:text-3xl font-bold mb-3">
                👷 Welcome to the Engineer Dashboard!
            </h1>
            <p className="text-gray-600 text-base md:text-lg bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                This is where maintenance, construction, and planning tasks are handled.
            </p>
        </div>

        {/* You can add grid/content here later */}
        
        <BottomNav homeRoute="/engineer-dashboard" />
    </div>
);

export default EngineerDashboard;