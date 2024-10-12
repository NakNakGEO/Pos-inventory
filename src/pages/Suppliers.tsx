import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';

const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [newSupplier, setNewSupplier] = useState({ name: '', contact: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateSupplier(editingId, newSupplier);
      setEditingId(null);
    } else {
      addSupplier(newSupplier);
    }
    setNewSupplier({ name: '', contact: '' });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Suppliers</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newSupplier.name}
          onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          placeholder="Supplier name"
          className="mr-2 p-2 border rounded"
        />
        <input
          type="text"
          value={newSupplier.contact}
          onChange={(e) => setNewSupplier({ ...newSupplier, contact: e.target.value })}
          placeholder="Contact information"
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? 'Update' : 'Add'} Supplier
        </button>
      </form>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier.id} className="flex items-center justify-between mb-2">
            <div>
              <span className="font-bold">{supplier.name}</span>
              <span className="ml-2 text-gray-600">{supplier.contact}</span>
            </div>
            <div>
              <button
                onClick={() => {
                  setEditingId(supplier.id);
                  setNewSupplier({ name: supplier.name, contact: supplier.contact });
                }}
                className="bg-yellow-500 text-white p-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => deleteSupplier(supplier.id)}
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

export default Suppliers;