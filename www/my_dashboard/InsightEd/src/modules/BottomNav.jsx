
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Using generic emojis for now, but you can import icons from react-icons here
// import { FaUser, FaChartLine, FaHome } from 'react-icons/fa';

const BottomNav = ({ homeRoute }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // specific styles for the footer container
    const navStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '60px',
        backgroundColor: '#fff',
        borderTop: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    };

    const itemStyle = (isActive) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        color: isActive ? '#004A99' : '#888', // Active = DepEd Blue, Inactive = Grey
        background: 'none',
        border: 'none',
        cursor: 'pointer'
    });

    return (
        <div style={navStyle}>
            {/* Activity Button */}
            <button 
                style={itemStyle(location.pathname === '/activities')} 
                onClick={() => navigate('/activities')}
            >
                <span style={{ fontSize: '20px' }}>⚡</span>
                <span>Activity</span>
            </button>

            {/* Dashboard (Home) Button */}
            <button 
                style={itemStyle(location.pathname === homeRoute)} 
                onClick={() => navigate(homeRoute)}
            >
                <span style={{ fontSize: '20px' }}>🏠</span>
                <span>Dashboard</span>
            </button>

            {/* Profile Button */}
            <button 
                style={itemStyle(location.pathname === '/profile')} 
                onClick={() => navigate('/profile')}
            >
                <span style={{ fontSize: '20px' }}>👤</span>
                <span>Profile</span>
            </button>
        </div>
    );
};

export default BottomNav;