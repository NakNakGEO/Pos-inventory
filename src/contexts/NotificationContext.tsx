import React, { createContext, useState, useContext, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'warning' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type: 'info' | 'warning' | 'error') => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { products } = useProducts();

  const addNotification = (message: string, type: 'info' | 'warning' | 'error') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  useEffect(() => {
    const lowStockProducts = products.filter(product => product.stock < 10);
    lowStockProducts.forEach(product => {
      addNotification(`Low stock alert: ${product.name} (${product.stock} left)`, 'warning');
    });
  }, [products]);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};