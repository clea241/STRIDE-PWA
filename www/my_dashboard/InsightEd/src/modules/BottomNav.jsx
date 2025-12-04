// src/BottomNav.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ homeRoute }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper to determine if a tab is active
    const isActive = (path) => location.pathname === path;

    // Common button class
    const navBtnClass = "flex flex-col items-center justify-center w-full h-full border-none bg-transparent cursor-pointer transition-colors";

    return (
        <div className="fixed bottom-0 left-0 w-full h-[70px] bg-white border-t border-gray-200 flex justify-around items-center z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-1">
            
            {/* Activity Button */}
            <button 
                className={`${navBtnClass} ${isActive('/activities') ? 'text-[#004A99]' : 'text-gray-400'}`}
                onClick={() => navigate('/activities')}
            >
                <span className="text-2xl mb-1">⚡</span>
                <span className="text-xs font-medium">Activity</span>
            </button>

            {/* Dashboard (Home) Button */}
            <button 
                className={`${navBtnClass} ${isActive(homeRoute) ? 'text-[#004A99]' : 'text-gray-400'}`}
                onClick={() => navigate(homeRoute)}
            >
                <span className="text-2xl mb-1">🏠</span>
                <span className="text-xs font-medium">Dashboard</span>
            </button>

            {/* Profile Button */}
            <button 
                className={`${navBtnClass} ${isActive('/profile') ? 'text-[#004A99]' : 'text-gray-400'}`}
                onClick={() => navigate('/profile')}
            >
                <span className="text-2xl mb-1">👤</span>
                <span className="text-xs font-medium">Profile</span>
            </button>
        </div>
    );
};

export default BottomNav;