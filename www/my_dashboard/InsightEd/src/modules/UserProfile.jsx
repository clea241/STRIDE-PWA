import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase";

const UserProfile = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '80px' }}>
            <h1>User Profile</h1>
            <p>User details will go here.</p>
            <button onClick={handleLogout} style={{ backgroundColor: '#CC0000', color: 'white', padding: '10px' }}>
                Logout
            </button>
            
            {/* NOTE: We have a logic issue here. 
                If we put the BottomNav here, we need to know WHICH dashboard to go back to.
                See the tip below. 
            */}
        </div>
    );
};

export default UserProfile;