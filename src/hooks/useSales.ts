import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Sale } from '../types';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const fetchedSales = await api.getSales();
        setSales(fetchedSales);
      } catch (error) {
        console.error('Error fetching sales:', error);
        setSales([]);
      }
    };
    fetchSales();
  }, []);

  const addSale = async (sale: Omit<Sale, 'id'>) => {
    try {
      const newSale = await api.addSale(sale);
      setSales([...sales, newSale]);
    } catch (error) {
      console.error('Error adding sale:', error);
    }
  };

  return { sales, addSale };
};