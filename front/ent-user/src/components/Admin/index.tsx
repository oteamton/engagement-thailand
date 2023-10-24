import React, { useState, useEffect } from 'react';
import './styles.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isRoleActivated: boolean;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch the list of users with pending roles here.
    // For demonstration purposes, I'll use a mock list.
    const mockUsers: User[] = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', isRoleActivated: false },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', isRoleActivated: false }
    ];
    setUsers(mockUsers);
  }, []);

  const handleActivateRole = async (user: User) => {
    const confirmAction = window.confirm(`Are you sure you want to activate the role for ${user.name}?`);
    if (!confirmAction) return;

    try {
      const response = await fetch('http://localhost:8000/endpoint/register/users.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id, role: user.role })
      });

      if (response.ok) {
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, isRoleActivated: true } : u);
        setUsers(updatedUsers);
      } else {
        console.error("Failed to activate role");
      }
    } catch (error) {
      console.error("Error activating role:", error);
    }
  }

  return (
    <div className='admin-panel'>
      <h1>Admin Panel</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
            <div>Role: {user.role}</div>
            {user.isRoleActivated ? (
              <span>Role Activated</span>
            ) : (
              <button onClick={() => handleActivateRole(user)}>Activate role</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
