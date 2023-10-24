import React, { useState, useEffect } from 'react';
import './styles.css';

interface User {
  id: string;
  name: string;
  email: string;
  role: number;
  role_status_id: number;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  
  

  const handleActivateRole = async (user: User) => {
    const confirmAction = window.confirm(`Are you sure you want to activate the role for ${user.name}?`);
    if (!confirmAction) return;

    try {
      const response = await fetch('http://localhost:8000/endpoint/admin/admin_panel.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id, role: user.role })
      });

      if (response.ok) {
        const updatedUsers = users.map(u => u.id === user.id ? { ...u, role_status_id: 1 } : u);
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
            {user.role_status_id ? (
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
