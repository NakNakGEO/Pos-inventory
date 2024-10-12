import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';

const Categories: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory(editingId, newCategory);
      setEditingId(null);
    } else {
      addCategory(newCategory);
    }
    setNewCategory('');
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Categories</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Category name"
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Category
        </button>
      </form>
      <ul>
        {categories.map((category) => (
          <li key={category.id} className="flex items-center justify-between mb-2">
            <span>{category.name}</span>
            <div>
              <button
                onClick={() => {
                  setEditingId(category.id);
                  setNewCategory(category.name);
                }}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteCategory(category.id)}
                className="bg-red-500 text-white p-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;