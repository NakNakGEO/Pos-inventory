import { useState, useEffect, useCallback } from 'react';
import api, { markPurchaseOrderAsReceived } from '../services/api';
import { PurchaseOrder } from '../types';
import { handleApiError } from '../utils/errorHandling';

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/purchase-orders');
      console.log('Purchase orders response:', response.data);
      setPurchaseOrders(response.data);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const addPurchaseOrder = async (data: Omit<PurchaseOrder, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/purchase-orders', data);
      setPurchaseOrders(prevOrders => [...prevOrders, response.data]);
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrder = async (id: number, data: Partial<PurchaseOrder>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/purchase-orders/${id}`, data);
      setPurchaseOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? response.data : order
        )
      );
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseOrder = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/purchase-orders/${id}`);
      setPurchaseOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAsReceived = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await markPurchaseOrderAsReceived(id);
      setPurchaseOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === id ? { ...order, status: 'completed' } : order
        )
      );
      return updatedOrder;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  return {
    purchaseOrders,
    loading,
    error,
    fetchPurchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    markAsReceived
  };
};
