import React, { useState, useEffect } from 'react';
import GuestContent from '../RoleBasedContent/GuestContent';
import PremiumContent from '../RoleBasedContent/PremiumContent';
import StandardContent from '../RoleBasedContent/StandardContent';
import './styles.css'
type User = {
  name: string;
  email: string;
  role: {
    status: 'active' | 'pending';
    roleName: 'guest' | 'premium' | 'standard';
    duration?: string;
  };
};

const UserPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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

  const renderContentByRole = (roleName: string) => {
    switch (roleName) {
      case 'admin':
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
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <a href="/editform">EditForm</a>
        </div>
        <div>
          {user.role.status === 'active' ? (
            <>
              <h3>Role: {user.role.roleName}</h3>
              <p>Duration: {user.role.duration}</p>
            </>
          ) : (
            <h3>Waiting for admin approval</h3>
          )}
        </div>
      </div>
      <div>
        {user.role.status === 'active' ? renderContentByRole(user.role.roleName) :
          <div>
            <h3>Waiting for admin approval</h3>
          </div>}
      </div>
    </div>
  );
};

// Mock fetchUserData function
const fetchUserData = async (): Promise<User> => {
  // This is a mock. Replace this with actual API calls.
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'john@example.com',
        role: {
          status: 'pending',
          roleName: 'guest',
          duration: '1 year',
        },
      });
    }, 1000);
  });
};

export default UserPage;
