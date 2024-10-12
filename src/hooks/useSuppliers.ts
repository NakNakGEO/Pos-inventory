import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Supplier } from '../types';

export const useSuppliers = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const fetchedSuppliers = await api.getSuppliers();
        setSuppliers(fetchedSuppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const newSupplier = await api.addSupplier(supplier);
      setSuppliers([...suppliers, newSupplier]);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const updateSupplier = async (id: number, supplier: Omit<Supplier, 'id'>) => {
    try {
      const updatedSupplier = await api.updateSupplier(id, supplier);
      setSuppliers(suppliers.map(s => s.id === id ? updatedSupplier : s));
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      await api.deleteSupplier(id);
      setSuppliers(suppliers.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return { suppliers, addSupplier, updateSupplier, deleteSupplier };
};