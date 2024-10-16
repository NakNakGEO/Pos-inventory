import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types';
import { Edit, Trash2, Plus } from 'lucide-react';
import api from '../services/api';

const Categories: React.FC = () => {
  const { categories, fetchCategories } = useCategories();
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'>>({ name: '', description: '', parentId: null });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      api.put(`/categories/${editingCategory.id}`, newCategory);
      setEditingCategory(null);
    } else {
      api.post('/categories', newCategory);
    }
    setNewCategory({ name: '', description: '', parentId: null });
    fetchCategories(); // Refresh the categories list after adding or updating
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ name: category.name, description: category.description, parentId: category.parentId });
  };
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories(); // Refresh the categories list after deletion
    } catch (error) {
      console.error('Error deleting category:', error);
      // You might want to add some user feedback here, e.g. a toast notification
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Category Name"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4">{category.name}</td>
              <td className="py-2 px-4">
                <button onClick={() => handleEdit(category)} className="mr-2 text-blue-500">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(category.id)} className="text-red-500">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
