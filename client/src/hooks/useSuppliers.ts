import { useState, useEffect } from 'react';
import api from '../services/api';
import { Supplier } from '../types';
import { PostgrestError } from '@supabase/supabase-js';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSuppliers = await api.get('/suppliers');
      setSuppliers(fetchedSuppliers.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newSupplier = await api.post('/suppliers', supplier);
      setSuppliers(prevSuppliers => [...prevSuppliers, newSupplier.data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id: number, supplier: Omit<Supplier, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSupplier = await api.put(`/suppliers/${id}`, supplier);
      setSuppliers(prevSuppliers => prevSuppliers.map(s => s.id === id ? updatedSupplier.data : s));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(prevSuppliers => prevSuppliers.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { suppliers, loading, error, fetchSuppliers, addSupplier, updateSupplier, deleteSupplier };
};
