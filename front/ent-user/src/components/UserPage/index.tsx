import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logout from '../../utils/logout';
import GuestContent from '../RoleBasedContent/GuestContent';
import PremiumContent from '../RoleBasedContent/PremiumContent';
import StandardContent from '../RoleBasedContent/StandardContent';
import UserPanel from '../UserPanel';
import './styles.css'

const UserPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/endpoint/user/get_user_data.php', {
        withCredentials: true // This is the important part
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
    <div className="page-container">
      <UserPanel user={user} onEdit={() => {}} onLogout={() => {}} />
    </div>
  );
};

export default UserPage;
