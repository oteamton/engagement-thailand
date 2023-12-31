import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserPanel from '../UserPanel';
import EntLogo from '../../assets/Ent_logo280.png';
import LoadingWrapper from '../../utils/LoadingWrapper';
import './styles.css';

const UserPage: React.FC = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPanelExpanded, setPanelExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/endpoint/user/user_get_data.php', {
        withCredentials: true // This is the important part
      });

      // console.log('Backend response:', response); // Logging the entire response for debug purposes
      // console.log('Backend data:', response.data); 

      setUser(response.data);
      setLoading(false);
    } catch (error: any) {
      // console.error('Error fetching user data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const togglePanel = () => {
    setPanelExpanded(!isPanelExpanded);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
      setPanelExpanded(false);
    }
  };

  useEffect(() => {
    getUserData();

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) {
    return <LoadingWrapper />;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  // const renderContentByRole = (role: string) => {
  //   switch (role) {
  //     case 'Standard':
  //       return <StandardContent />;
  //     case 'Organization':
  //       return <OrganizationContent />;
  //     case 'Individual':
  //       return <IndividualContent />;
  //   }
  // };

  return (
    <div className='page-container'>
      <div ref={panelRef} onClick={togglePanel}>
        <UserPanel user={user} isExpanded={isPanelExpanded}
          onToggle={setPanelExpanded} />
      </div>

      <div className={`content ${isPanelExpanded ? 'blurred' : ''}`}>
        <div className='title'>
          <h1>Welcome to Engagement Thailand</h1>
        </div>

        <div className="holding-container">
          <img className="ent_logo" src={EntLogo} alt="ent logo" />
        </div>

        <div className="soon">
          <h2>More content coming soon . . .</h2>
        </div>

        {/* {renderContentByRole(user.role)} */}
      </div>
      <div className='dark-bg'></div>
    </div>
  );
};

export default UserPage;
