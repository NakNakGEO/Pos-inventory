import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Customer } from '../types';

export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await api.getCustomers();
        setCustomers(fetchedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const newCustomer = await api.addCustomer(customer);
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const updateCustomer = async (id: number, customer: Omit<Customer, 'id'>) => {
    try {
      const updatedCustomer = await api.updateCustomer(id, customer);
      setCustomers(prevCustomers => prevCustomers.map(c => c.id === id ? updatedCustomer : c));
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      await api.deleteCustomer(id);
      setCustomers(prevCustomers => prevCustomers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return { customers, addCustomer, updateCustomer, deleteCustomer };
};