import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Customer } from '../types';
import { Edit, Trash2 } from 'lucide-react';

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'createdAt' | 'address' | 'loyaltyPoints'>>({ name: '', email: '', phone: '' });
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        ...editingCustomer,
        ...newCustomer
      });
      setEditingCustomer(null);
    } else {
      addCustomer({
        ...newCustomer,
        address: '',
        loyaltyPoints: 0,
        createdAt: new Date()
      });
    }
    setNewCustomer({ name: '', email: '', phone: '' });
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone });
  };

  const handleDelete = (id: number) => {
    deleteCustomer(id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Name"
          value={newCustomer.name || ''}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email || ''}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={newCustomer.phone || ''}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingCustomer ? 'Update Customer' : 'Add Customer'}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">{customer.phone}</td>
              <td className="py-2 px-4">
                <button onClick={() => handleEdit(customer)} className="mr-2 text-blue-500">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(customer.id)} className="text-red-500">
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

export default Customers;
