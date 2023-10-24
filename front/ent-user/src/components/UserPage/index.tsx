import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GuestContent from '../RoleBasedContent/GuestContent';
import PremiumContent from '../RoleBasedContent/PremiumContent';
import StandardContent from '../RoleBasedContent/StandardContent';
import './styles.css'

const UserPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = localStorage.getItem('session_id');

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/endpoint/user/get_user_data.php', {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });

      console.log('Backend response:', response); // Logging the entire response for debug purposes
      console.log('Backend data:', response.data);

      setUser(response.data);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  const renderContentByRole = (role: string) => {
    switch (role) {
      case 'premium':
        return <PremiumContent />;
      case 'standard':
        return <StandardContent />;
      case 'guest':
        return <GuestContent />;
      default:
        return <div>General content</div>;
    }
  };

  return (
    <div>
      <div className='user-profile-page'>
        <div>
          <h2>{user.username}</h2>
          <p>{user.email}</p>
          <a href="/editform">EditForm</a>
        </div>
        <div>
          {user.role_status === 'pending' ? (
            <>
              <h3>Role: {user.role}</h3>
              <h3>Status: {user.role_status}</h3>
              <p>Duration: {user.role_duration}</p>
            </>
          ) : (
            <h3>Waiting for admin approval</h3>
          )}
        </div>
      </div>
      <div>
        {user.role_status === 'active' ? renderContentByRole(user.role) :
          <div>
            <h3>Waiting for admin approval</h3>
          </div>}
      </div>
    </div>
  );
};

// Mock fetchUserData function
// const fetchUserData = async (): Promise<User> => {
// This is a mock. Replace this with actual API calls.
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         name: 'John Doe',
//         email: 'john@example.com',
//         role: {
//           status: 'pending',
//           roleName: 'guest',
//           duration: '1 year',
//         },
//       });
//     }, 1000);
//   });
// };

export default UserPage;
