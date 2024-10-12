import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { PurchaseOrder } from '../types';

export const usePurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      try {
        const fetchedPurchaseOrders = await api.getPurchaseOrders();
        setPurchaseOrders(fetchedPurchaseOrders);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
        setPurchaseOrders([]);
      }
    };
    fetchPurchaseOrders();
  }, []);

  const addPurchaseOrder = async (order: Omit<PurchaseOrder, 'id'>) => {
    try {
      const newOrder = await api.addPurchaseOrder(order);
      setPurchaseOrders(prevOrders => [...prevOrders, newOrder]);
    } catch (error) {
      console.error('Error adding purchase order:', error);
    }
  };

  const updatePurchaseOrder = async (updatedOrder: PurchaseOrder) => {
    try {
      const result = await api.updatePurchaseOrder(updatedOrder.id, updatedOrder);
      setPurchaseOrders(prevOrders => 
        prevOrders.map(order => order.id === updatedOrder.id ? result : order)
      );
    } catch (error) {
      console.error('Error updating purchase order:', error);
    }
  };

  const removePurchaseOrder = async (id: number) => {
    try {
      await api.deletePurchaseOrder(id);
      setPurchaseOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error removing purchase order:', error);
    }
  };

  return { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, removePurchaseOrder };
};