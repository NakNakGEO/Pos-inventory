import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Product } from '../types';
import { handleApiError } from '../utils/errorHandling';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (err) {
      throw handleApiError(err);
    }
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/products', product);
      setProducts(prevProducts => [...prevProducts, response.data]);
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = useCallback(async (id: number, productData: Partial<Product>) => {
    setLoading(true);
    setError(null);
    try {
      // Remove id, created_at, and updated_at from the update data
      const { id: _, created_at, updated_at, ...updateData } = productData;
      
      const response = await api.put(`/products/${id}`, updateData);
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product.id === id ? { ...product, ...response.data } : product
        )
      );
      return response.data;
    } catch (err) {
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const updateProductStock = async (productId: number, quantityToAdd: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`/products/${productId}/stock`, { quantityToAdd });
      const updatedProduct = response.data;

      setProducts(prevProducts =>
        prevProducts.map(p =>
          p.id === productId ? updatedProduct : p
        )
      );

      return updatedProduct;
    } catch (err) {
      console.error('Error updating product stock:', err);
      setError(handleApiError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    updateProductStock
  };
};
