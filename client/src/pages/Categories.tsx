import React, { useState, useCallback } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Package } from 'lucide-react';
import { Category } from '../types';
import CategoryForm from '../components/CategoryForm';
import ErrorMessage from '../components/ErrorMessage';
import { handleApiError } from '../utils/errorHandling';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import api from '../services/api';

const Categories: React.FC = () => {
  const { categories, loading, error: categoriesError, fetchCategories } = useCategories();

  const deleteCategory = async (id: number) => {
    try {
      // Implement the delete logic here
      await api.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };

  const addCategory = async (data: Omit<Category, 'id'>) => {
    try {
      await api.post('/categories', data);
      await fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: number, data: Omit<Category, 'id'>) => {
    try {
      await api.put(`/categories/${id}`, data);
      await fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteCategory(id);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  }, [deleteCategory]);

  const handleSubmit = async (data: Omit<Category, 'id'>) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await addCategory(data);
      }
      setShowForm(false);
      setEditingCategory(null);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('categories.title')}</h1>
      
      <ErrorMessage error={error || categoriesError} />
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="card-header">
            <CardTitle className="title-3d flex items-center">
              <Package className="mr-2" size={24} />
              {t('categories.categoryOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
            <div className="flex items-center mb-4">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('categories.searchPlaceholder')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-3 px-6 text-left whitespace-nowrap">{category.name}</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleEdit(category)} 
                            className="action-button edit-button"
                            aria-label="Edit category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)} 
                            className="action-button delete-button"
                            aria-label="Delete category"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
      >
        <Plus size={20} className="mr-2" />
        {t('Add Category')}
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="card-header">
              <CardTitle className="title-3d">
                {editingCategory ? t('categories.editCategory') : t('categories.addCategory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white rounded-b-lg">
              <CategoryForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCategory(null);
                }}
                initialData={editingCategory || undefined}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Categories;
