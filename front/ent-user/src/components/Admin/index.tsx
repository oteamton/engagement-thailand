import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  role: string;
  role_status: string;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/endpoint/admin/admin_get_users.php');

        if (response.data.status === 'success') {
          setUsers(response.data.data);
        } else {
          console.error("Failed to load users:", response.data.message);
        }
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadAllUsers();
  }, []);

  const renderBtn = (user: User) => {
    switch (user.role_status) {
      case 'active':
        return (
          <button onClick={() => handleRoleChange(user.id, 3)}>unactive</button> 
        )
      case 'pending':
        return (
          <button onClick={() => handleRoleChange(user.id, 2)}>active</button>
        )
      case 'unactive':
        return (
          <button onClick={() => handleRoleChange(user.id, 2)}>active</button>
        )
    }
  };

  const handleRoleChange = async (userId: number, newRoleId: number) => {
    const confirmAction = window.confirm('Are you sure you want to update the role status?');
    if (confirmAction) {
      await updateUserRole(userId, newRoleId);
    }
  };

  const updateUserRole = async (userId: number, newRoleId: number) => {
    try {
      const response = await axios.post('http://localhost:8000/endpoint/admin/admin_upd_users.php', {
        user_id: userId,
        role_status_id: newRoleId
      });

      if (response.data.status === 'success') {
        // Successfully updated the role. Now update the UI accordingly.
        setUsers(users.map(user => user.id === userId ? { ...user, role_status_id: newRoleId } : user));
      } else {
        console.error("Failed to update role:", response.data.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  return (
    <div className='admin-panel'>
      <h1>Admin Panel</h1>
      {/* Render user data as row banners */}
      <div className="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-row">
            <div className="user-data">ID: {user.id}</div>
            <div className="user-data">Username: {user.username}</div>
            <div className="user-data">Email: {user.email}</div>
            <div className="user-data">Name: {user.name}</div>
            <div className="user-data">Surname: {user.surname}</div>
            <div className="user-data">Role: {user.role}</div>
            <div className="user-data">
              Status: {user.role_status}
              {renderBtn(user)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
