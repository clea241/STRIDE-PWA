import React from 'react';
import BottomNav from './BottomNav'; // Import the footer

const AdminDashboard = () => (
    <div style={{ 
        padding: '20px', 
        paddingBottom: '80px', // <--- Add padding so footer doesn't hide text
        backgroundColor: '#FFFBEA', 
        minHeight: '100vh' 
    }}>
        <h1 style={{ color: '#CC0000' }}>👑 Welcome to the Admin Dashboard!</h1>
        <p>You have full access to manage users, roles, and system settings.</p>

        {/* Footer Navigation */}
        <BottomNav homeRoute="/admin-dashboard" />
    </div>
);

export default AdminDashboard;