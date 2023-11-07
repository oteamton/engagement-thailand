import React, { FC, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './styles.css';
import Logout from '../../utils/logout';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  role_status: string;
}

interface UserPanelProps {
  user: User;
  isExpanded: boolean;
  onToggle: (expanded: boolean) => void;
}

const UserPanel: FC<UserPanelProps> = ({ user, isExpanded, onToggle, }) => {
  const navigate = useNavigate();
  const togglePanel = () => {
    onToggle(!isExpanded);
  };

  const onEdit = () => {
    navigate('/edit-profile', { state: { user } });
  };

  const upgradeUser = () => {
    navigate('/upgrade-role', { state: { user } });
  };

  function getStatusClass(role_status: string) {
    switch (role_status) {
      case 'Pending':
        return 'sta-pending';
      case 'Active':
        return 'sta-active';
      case 'Expired':
        return 'sta-expired';
    }
  }

  return (
    <div
      className={`user-panel ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={togglePanel}
    >
      {isExpanded ? (
        <>
          <h2 className="user-panel-title">User Panel</h2>
          <div className="user-info">
            <p className="user-info-item"><strong>Username:</strong> {user.username}</p>
            <p className="user-info-item"><strong>Email:</strong> {user.email}</p>
            <p className="user-info-item"><strong>Role:</strong> {user.role} <strong className='status'>Status:</strong><p className={`${getStatusClass(user.role_status)}`}>{user.role_status}</p></p>
          </div>

          <div className="user-actions">
            <button className="user-action-button user-action-edit" onClick={onEdit}>Edit Profile</button>
            <button className="user-action-button user-action-edit" onClick={upgradeUser}>Join us</button>
            <Logout />
          </div>
        </>
      ) : (
        <div className="compact-info">
          <p className="compact-username">Username: <span>{user.username}</span></p>
          <p className="compact-email">Member type: <span>{user.role}</span></p>
        </div>
      )}
    </div >
  );
};

export default UserPanel;
