import { useState, useEffect } from 'react';
import api from '../services/api';
import { PurchaseOrder, PurchaseOrderItem } from '../types';
import { handleApiError } from '../utils/errorHandling';

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPurchaseOrders = await api.get('/purchase-orders');
      setPurchaseOrders(fetchedPurchaseOrders.data);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const addPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>, orderItems: Omit<PurchaseOrderItem, 'id'>[]) => {
    setLoading(true);
    setError(null);
    try {
      const newOrder = await api.post('/purchase-orders', { order, orderItems });
      setPurchaseOrders(prevOrders => [...prevOrders, newOrder.data as unknown as PurchaseOrder]);
      return newOrder.data as unknown as PurchaseOrder;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error adding purchase order:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updatePurchaseOrder = async (id: number, order: Partial<PurchaseOrder>) => {
    setLoading(true);
    setError(null);
    try {
      const currentOrder = purchaseOrders.find(o => o.id === id);
      if (!currentOrder) {
        throw new Error('Purchase order not found');
      }
      const completeOrder: Omit<PurchaseOrder, 'id'> = { ...currentOrder, ...order };
      const updatedOrder = await api.put(`/purchase-orders/${id}`, { completeOrder, orderItems: [] });
      setPurchaseOrders(prevOrders => 
        prevOrders.map(o => o.id === id ? updatedOrder.data as unknown as PurchaseOrder : o)
      );
      return updatedOrder.data as unknown as PurchaseOrder;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error updating purchase order:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deletePurchaseOrder = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/purchase-orders/${id}`);
      setPurchaseOrders(prevOrders => prevOrders.filter(o => o.id !== id));
    } catch (err) {
      setError(handleApiError(err));
      console.error('Error deleting purchase order:', err);
    } finally {
      setLoading(false);
    }
  };

  return { 
    purchaseOrders, 
    loading, 
    error, 
    fetchPurchaseOrders, 
    addPurchaseOrder, 
    updatePurchaseOrder, 
    deletePurchaseOrder 
  };
};