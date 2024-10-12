import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await api.getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const addCategory = async (name: string) => {
    try {
      const newCategory = await api.addCategory({ name });
      setCategories(prevCategories => [...prevCategories, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: number, name: string) => {
    try {
      const updatedCategory = await api.updateCategory(id, { name });
      setCategories(prevCategories => 
        prevCategories.map(c => c.id === id ? updatedCategory : c)
      );
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await api.deleteCategory(id);
      setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return { categories, addCategory, updateCategory, deleteCategory };
};