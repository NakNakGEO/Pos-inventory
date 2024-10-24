import { useState, useCallback } from 'react';
import { Customer } from '../types';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandling';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/customers');
      setCustomers(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addCustomer = useCallback(async (customer: Omit<Customer, 'id' | 'created_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/customers', customer);
      setCustomers(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCustomer = useCallback(async (id: number, customer: Partial<Omit<Customer, 'id' | 'created_at'>>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/customers/${id}`, customer);
      setCustomers(prev => prev.map(c => c.id === id ? response.data : c));
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCustomer = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/customers/${id}`);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { customers, loading, error, fetchCustomers, addCustomer, updateCustomer, deleteCustomer };
};
