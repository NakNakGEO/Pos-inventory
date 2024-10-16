import { useState, useEffect } from 'react';
import api from '../services/api';
import { handleApiError } from '../utils/errorHandling';
import { logger } from '../utils/logger';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCategories = await api.get('/categories');
      setCategories(fetchedCategories.data);
      logger.info('Categories fetched successfully');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (newCategory: Omit<Category, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const addedCategory = await api.post('/categories', newCategory);
      setCategories([...categories, addedCategory.data as unknown as Category]);
      logger.info('Category added successfully');
      return addedCategory.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Error adding category', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, updatedCategory: Partial<Category>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await api.put(`/categories/${id}`, updatedCategory);
      setCategories(categories.map(cat => cat.id === parseInt(id) ? updated.data as unknown as Category : cat) as Category[]);
      logger.info('Category updated successfully');
      return updated.data;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Error updating category', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== parseInt(id)) as Category[]);
      logger.info('Category deleted successfully');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      logger.error('Error deleting category', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, fetchCategories };
};
