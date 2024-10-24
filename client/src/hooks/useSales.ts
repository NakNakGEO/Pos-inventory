import { useState, useEffect } from 'react';
import api from '../services/api';
import { Sale, NewSale } from '../types';
import { handleApiError } from '../utils/errorHandling';

export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/sales');
      setSales(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: NewSale) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/sales', sale);
      setSales(prevSales => [...prevSales, response.data]);
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSale = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/sales/${id}`);
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    fetchSales,
    addSale,
    getSale
  };
};
