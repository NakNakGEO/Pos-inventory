import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosRequestConfig, AxiosHeaders } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Supplier, Product, PurchaseOrder } from '../types';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const login = async (username: string, password: string): Promise<boolean> => {
  try {
    console.log('Sending login request with:', { username, password: '****' });
    const response: AxiosResponse = await api.post('/login', { username, password });
    console.log('Login response:', response);
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      return true;
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
  return false;
};

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem('token');
};

export const logout = (): void => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

api.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token) {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    if (Date.now() >= tokenData.exp * 1000) {
      return Promise.reject('Token expired') as any;
    }
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    }
    return false;
  } catch (error) {
    return true;
  }
};

export const fetchSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response: AxiosResponse<Supplier[]> = await api.get('/suppliers');
    return response.data;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw error;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response: AxiosResponse<Product[]> = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const response: AxiosResponse<PurchaseOrder[]> = await api.get('/purchase-orders');
    return response.data;
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    throw error;
  }
};

export const addPurchaseOrder = async (data: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> => {
  try {
    console.log('Sending purchase order data to server:', data);
    const response: AxiosResponse<PurchaseOrder> = await api.post('/purchase-orders', data);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding purchase order:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
};

export const updatePurchaseOrder = async (id: number, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> => {
  try {
    const response: AxiosResponse<PurchaseOrder> = await api.patch(`/purchase-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating purchase order:', error);
    throw error;
  }
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`/purchase-orders/${id}`);
  } catch (error) {
    console.error('Error deleting purchase order:', error);
    throw error;
  }
};

export const markPurchaseOrderAsReceived = async (id: number): Promise<PurchaseOrder> => {
  try {
    const response: AxiosResponse<PurchaseOrder> = await api.patch(`/purchase-orders/${id}`, { status: 'completed' });
    return response.data;
  } catch (error) {
    console.error('Error marking purchase order as received:', error);
    throw error;
  }
};

export default api;
