import React, { FC, useState } from 'react';
import './UserPanel.css';
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
  onEdit: () => void;
  onLogout: () => void;
}

const UserPanel: FC<UserPanelProps> = ({ user, onEdit, onLogout }) => {
  const [isExpanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!isExpanded);
  };

  return (
    <div
      className={`user-panel ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={toggleExpanded}
    >
      {isExpanded ? (
        <>
          <h2 className="user-panel-title">User Panel</h2>
          <div className="user-info">
            <p className="user-info-item"><strong>ID:</strong> {user.id}</p>
            <p className="user-info-item"><strong>Username:</strong> {user.username}</p>
            <p className="user-info-item"><strong>Email:</strong> {user.email}</p>
            <p className="user-info-item"><strong>Role:</strong> {user.role} <strong>Status:</strong> {user.role_status}</p>
          </div>
          <div className="user-actions">
            <button className="user-action-button user-action-edit" onClick={onEdit}>Edit Profile</button>
            <button className="user-action-button user-action-logout" onClick={Logout}>Log Out</button>
          </div>
        </>
      ) : (
        <div className="compact-info">
          <span className="compact-username">{user.username}</span>
          <span className="compact-email">{user.role}</span>
        </div>
      )}
    </div >
  );
};

export default UserPanel;
