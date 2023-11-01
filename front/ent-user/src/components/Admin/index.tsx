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
  const [search, setSearch] = useState('');

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

  const activeUser = async (id: number, newStatus: string, newStatusId: number, email: string) => {
    let confirmAction;

    switch (newStatusId) {
      case 3:
        confirmAction = window.confirm('Are you sure you want to inactive this user?');
        break;
      case 2 || 1:
        confirmAction = window.confirm('Are you sure you want to active this user?');
        break;
    }

    if (confirmAction) {
      try {
        const response = await axios.post('http://localhost:8000/endpoint/admin/admin_upd_users.php', {
          user_id: id,
          role_status_id: newStatusId,
          email: email
        });

        if (response.data.status === 'success') {
          const updatedUsers = users.map((user) =>
            user.id === id ? { ...user, role_status: newStatus } : user
          );
          loadAllUsers();
        } else {
          console.error(`Failed to update role to ${newStatus}`, response.data.message);
        }
      } catch (error) {
        console.error("Error updating role:", error);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    return Object.values(user).some((field) =>
      field.toString().toLowerCase().includes(search.toLowerCase())
    );
  });

  const sortUsers = (field: keyof User) => {
    const sortedUsers = [...users].sort((a, b) => {
      if (a[field] < b[field]) return -1;
      if (a[field] > b[field]) return 1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return 'status-active';
      case 'Expired':
        return 'status-expired';
      case 'Pending':
        return 'status-pending';
      case 'Admin':
        return 'role-admin';
      default:
        return '';
    }
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  return (
    <div className="admin-panel">
      <input
        className="search-input"
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="user-table">
        <thead>
          <tr>
            <th className="table-header">
              Username
              <button className="sort-button" onClick={() => sortUsers('username')}>↑↓</button>
            </th>
            <th className="table-header">
              Name
              <button className="sort-button" onClick={() => sortUsers('name')}>↑↓</button>
            </th>
            <th className="table-header">
              Email
              <button className="sort-button" onClick={() => sortUsers('email')}>↑↓</button>
            </th>
            <th className="table-header">
              Status
              <button className="sort-button" onClick={() => sortUsers('role')}>↑↓</button>
            </th>
            <th className="table-header">
              Status
              <button className="sort-button" onClick={() => sortUsers('role_status')}>↑↓</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td className={getStatusClass(user.role)}>{user.role}</td>
              <td className={getStatusClass(user.role_status)}>{user.role_status}</td>
              <td>
                {user.role_status === "Pending" && (
                  <button className='admin-btn' onClick={() => activeUser(user.id, 'Active', 2, user.email)}>Set Active</button>
                )}
                {user.role_status === "Expired" && (
                  <button className='admin-btn' onClick={() => activeUser(user.id, 'Active', 2, user.email)}>Set Reactive</button>
                )}
                {user.role_status === "Active" && (
                  <button className='admin-btn' onClick={() => activeUser(user.id, 'Expired', 3, user.email)}>Set Expired</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='dark-bg'></div>
    </div>
  );
}

export default AdminPanel;
