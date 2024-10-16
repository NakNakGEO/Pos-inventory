import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Sale, SaleItem } from '../types';
import { handleApiError } from '../utils/errorHandling';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedSales = await api.get('/sales');
      setSales(fetchedSales.data);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const addSale = async (sale: Omit<Sale, 'id'>, saleItems: Omit<SaleItem, 'id'>[]) => {
    setLoading(true);
    setError(null);
    try {
      const newSale = await api.post('/sales', { sale, saleItems });
      setSales((prevSales: any) => [...prevSales, newSale.data as unknown as Sale]);
      return newSale;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id: number, sale: Omit<Sale, 'id'>, saleItems: Omit<SaleItem, 'id'>[]) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSale = await api.put(`/sales/${id}`, { sale, saleItems });
      setSales(prevSales => prevSales.map(s => s.id === id ? updatedSale.data as unknown as Sale : s) as Sale[]);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteSale = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/sales/${id}`);
      setSales(prevSales => prevSales.filter(s => s.id !== id) as Sale[]);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sales, loading, error, fetchSales, addSale, updateSale, deleteSale };
};
