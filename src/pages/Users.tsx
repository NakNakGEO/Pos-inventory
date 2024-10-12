import React, { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { User, UserRole } from '../types';

const Users: React.FC = () => {
  const { users, addUser, updateUser, deleteUser } = useUsers();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    username: '',
    password: '',
    role: 'user' as UserRole,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, newUser);
      setEditingUser(null);
    } else {
      addUser(newUser);
    }
    setNewUser({ username: '', password: '', role: 'user' });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">User Management</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Username"
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Password"
          className="mr-2 p-2 border rounded"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
          className="mr-2 p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex items-center justify-between mb-2">
            <span>{user.username} - {user.role}</span>
            <div>
              <button
                onClick={() => {
                  setEditingUser(user);
                  setNewUser({ username: user.username, password: '', role: user.role });
                }}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;