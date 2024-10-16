import { useState, useEffect } from 'react';
import api from '../services/api';
import { Customer, User } from '../types';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement getCustomers method in ApiService
      const fetchedCustomers = await api.get('/users');
      setCustomers(fetchedCustomers.data);
    } catch (err) {
      setError('Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement addCustomer method in ApiService
      const newCustomer = await api.post('/users', customer as unknown as User);
      setCustomers(prevCustomers => [...prevCustomers, newCustomer.data as unknown as Customer]);
    } catch (err) {
      setError('Failed to add customer');
      console.error('Error adding customer:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: number, customer: Partial<Customer>) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement updateCustomer method in ApiService
      const updatedCustomer = await api.put(`/users/${id}`, customer as unknown as User);
      setCustomers(prevCustomers => prevCustomers.map(c => c.id === id ? updatedCustomer.data as unknown as Customer : c));
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement deleteCustomer method in ApiService
      await api.delete(`/users/${id}`);
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== id));
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    customers, 
    loading, 
    error, 
    fetchCustomers, 
    addCustomer, 
    updateCustomer, 
    deleteCustomer 
  };
};

// Explanation for using 'as unknown as User' and 'as unknown as Customer':

// The use of 'as unknown as User' and 'as unknown as Customer' in this code is a type assertion
// technique used to bypass TypeScript's type checking. This is likely done because the ApiService
// methods are currently working with User types, while this hook is intended to work with Customer types.

// This approach is not ideal and indicates a mismatch between the expected types (Customer) and
// the actual types being used by the API (User). It's a temporary workaround that allows the code
// to compile and run, but it doesn't provide type safety.

// A better approach would be to:
// 1. Update the ApiService to have specific methods for Customers (getCustomers, addCustomer, etc.)
// 2. Ensure that the Customer and User types are properly aligned or create a proper mapping between them
// 3. Remove these type assertions and use the correct types throughout the code

// The TODOs in the code also suggest that these are temporary solutions until proper Customer-specific
// methods are implemented in the ApiService. Once those are in place, these type assertions should be removed.
