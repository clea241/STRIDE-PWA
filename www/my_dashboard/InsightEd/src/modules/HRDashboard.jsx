import React from 'react';
import BottomNav from './BottomNav'; // Import the footer

const HRDashboard = () => (
    <div style={{ 
        padding: '40px', 
        paddingBottom: '80px', // <--- Add padding
        backgroundColor: '#F0F0F0', 
        minHeight: '100vh' 
    }}>
        <h1 style={{ color: '#CC0000' }}>👩‍💼 Welcome to the Human Resource Dashboard!</h1>
        <p style={{ color: '#004A99' }}>This is where you manage personnel records, training, and employee welfare.</p>

        {/* Footer Navigation */}
        <BottomNav homeRoute="/hr-dashboard" />
    </div>
);

export default HRDashboard;