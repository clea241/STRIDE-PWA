
import React from 'react';
import BottomNav from './BottomNav';

const EngineerDashboard = () => (
    <div style={{ 
        padding: '20px', 
        paddingBottom: '80px', // <--- EXTRA PADDING for the footer
        backgroundColor: '#F0F0F0', 
        minHeight: '100vh' 
    }}>
        <h1 style={{ color: '#004A99' }}>👷 Welcome to the Engineer Dashboard!</h1>
        <p>This is where maintenance, construction, and planning tasks are handled.</p>
        
        {/* Pass the specific route for this user type */}
        <BottomNav homeRoute="/engineer-dashboard" />
    </div>
);

export default EngineerDashboard;