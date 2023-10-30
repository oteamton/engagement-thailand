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
  onLogout: () => void;
}

const UserPanel: FC<UserPanelProps> = ({ user, isExpanded, onToggle, onLogout }) => {
  const navigate = useNavigate();
  const togglePanel = () => {
    onToggle(!isExpanded);
  };

  const onEdit = () => {
    navigate('/edit-profile', { state: { user } });
  };

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
            <p className="user-info-item"><strong>Role:</strong> {user.role} <strong>Status:</strong> {user.role_status}</p>
          </div>

          <div className="user-actions">
            <button className="user-action-button user-action-edit">Join us</button>
            <button className="user-action-button user-action-edit" onClick={onEdit}>Edit Profile</button>
            <button className="user-action-button user-action-logout" onClick={Logout}>Log Out</button>
          </div>
        </>
      ) : (
        <div className="compact-info">
          <span className="compact-username">Username: {user.username}</span>
          <span className="compact-email">{user.role}</span>
        </div>
      )}
    </div >
  );
};

export default UserPanel;
