import { useState, useEffect } from 'react';
import api from '../services/api';
import { User } from '../types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await api.get('/users');
      setUsers(fetchedUsers.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await api.post('/users', user);
      setUsers(prevUsers => [...prevUsers, newUser.data]);
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: number, user: Omit<User, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await api.put(`/users/${id}`, user);
      setUsers(prevUsers => prevUsers.map(u => u.id === id ? updatedUser.data : u));
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/${id}`);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    users, 
    loading, 
    error, 
    fetchUsers, 
    addUser, 
    updateUser, 
    deleteUser 
  };
};
