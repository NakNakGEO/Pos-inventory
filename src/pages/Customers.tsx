import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { useTranslation } from 'react-i18next';

const Customers: React.FC = () => {
  const { t } = useTranslation();
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustomer(editingId, newCustomer);
      setEditingId(null);
    } else {
      addCustomer(newCustomer);
    }
    setNewCustomer({ name: '', email: '', phone: '' });
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">{t('customers')}</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          placeholder={t('name')}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="email"
          value={newCustomer.email}
          onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
          placeholder={t('email')}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="tel"
          value={newCustomer.phone}
          onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
          placeholder={t('phone')}
          className="mr-2 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingId ? t('updateCustomer') : t('addCustomer')}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">{t('name')}</th>
            <th className="py-3 px-6 text-left">{t('email')}</th>
            <th className="py-3 px-6 text-left">{t('phone')}</th>
            <th className="py-3 px-6 text-center">{t('actions')}</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{customer.name}</td>
              <td className="py-3 px-6 text-left">{customer.email}</td>
              <td className="py-3 px-6 text-left">{customer.phone}</td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => {
                    setEditingId(customer.id);
                    setNewCustomer({ name: customer.name, email: customer.email, phone: customer.phone });
                  }}
                  className="bg-yellow-500 text-white p-1 rounded mr-2"
                >
                  {t('edit')}
                </button>
                <button
                  onClick={() => deleteCustomer(customer.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  {t('delete')}
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