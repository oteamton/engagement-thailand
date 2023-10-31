import React from 'react';
import axios from 'axios';

const Logout: React.FC = () => {
    const handleLogout = async () => {
        try {
            // Make an API call to invalidate the session
            const response = await axios.post('http://localhost:8000/auth/logout.php', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                const data = response.data;
                if (data.status === 'success') {
                    console.log('Logged out successfully');

                    // Redirect to login page
                    window.location.href = "/login";
                } else {
                    console.error('Failed to log out');
                }
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('An error occurred:', error);
        }
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Logout;
