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

  function getRoleClass(role: string) {
    switch (role) {
      case 'Standard':
        return 'std';
      case 'Organization':
        return 'org';
      case 'Individual':
        return 'ind';
    }
  }

  function displayJoinUs(role: string) {
    if (role === 'Standard') {
      return (
        <button className="user-action-button user-action-join" onClick={upgradeUser}>Join Us!</button>
      )
    }
  }

  return (
    <div
      className={`user-panel ${isExpanded ? 'expanded' : 'compact'}`}
      onClick={togglePanel}
    >
      {isExpanded ? (
        <>
          <h2 className="user-panel-title">{user.username}</h2>
          <div className="user-info">
            {/* <p className="user-info-item"><strong>Username :</strong> {user.username}</p> */}
            <p className="user-info-item"><strong>Email :</strong> {user.email}</p>
            <p className="user-info-item"><strong>Role :</strong> <span className={`${getRoleClass(user.role)}`}>{user.role}</span> <strong className='status'>Status :</strong><span className={`${getStatusClass(user.role_status)}`}> {user.role_status}</span></p>
          </div>

          <div className="user-actions">
            <button className="user-action-button user-action-edit" onClick={onEdit}>Edit Profile</button>
            {displayJoinUs(user.role)}
            <Logout />
          </div>
        </>
      ) : (
        <div className="compact-info">
          <p className="compact-username">Username : <span>{user.username}</span></p>
          <p className="compact-email">Member type : <span className={`${getRoleClass(user.role)}`}>{user.role}</span></p>
        </div>
      )}
    </div >
  );
};

export default UserPanel;
