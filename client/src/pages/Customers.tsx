import React, { useState, useEffect } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { useTranslation } from 'react-i18next';
import { User, Search, Plus } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import CustomerForm from '../components/CustomerForm';
import ErrorMessage from '../components/ErrorMessage';
import { handleApiError } from '../utils/errorHandling';
import { Customer } from '../types';

const Customers: React.FC = () => {
  const { t } = useTranslation();
  const { customers, loading, error, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSubmit = async (formData: Omit<Customer, 'id' | 'created_at'>) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, formData);
      } else {
        await addCustomer(formData);
      }
      setEditingCustomer(null);
      setIsAddingCustomer(false); 
      fetchCustomers();
    } catch (err) {
      console.error('Error submitting customer:', err);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer && customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>{t('common.loading')}</div>;

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message); // Show error message to user
      } else {
        console.error('An unexpected error occurred:', err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('customers.title')}</h1>
      
      <ErrorMessage error={error} />
      
      <Card className="shadow-lg mb-6">
        <CardHeader className="card-header">
          <CardTitle className="title-3d flex items-center">
            <User className="mr-2" size={24} />
            {t('customers.customerList')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('customers.searchPlaceholder')}
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <Plus size={20} className="mr-2" />
              {t('customers.addCustomer')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <tr>
                  <th className="py-3 px-6 text-left">{t('customers.name')}</th>
                  <th className="py-3 px-6 text-left">{t('customers.email')}</th>
                  <th className="py-3 px-6 text-left">{t('customers.phone')}</th>
                  <th className="py-3 px-6 text-left">{t('customers.address')}</th>
                  <th className="py-3 px-6 text-center">{t('customers.loyaltyPoints')}</th>
                  <th className="py-3 px-6 text-center">{t('customers.actions')}</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{customer.name}</td>
                    <td className="py-3 px-6 text-left">{customer.email}</td>
                    <td className="py-3 px-6 text-left">{customer.phone}</td>
                    <td className="py-3 px-6 text-left">{customer.address}</td>
                    <td className="py-3 px-6 text-center">{customer.loyalty_points}</td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setEditingCustomer(customer)}
                          className="action-button edit-button"
                          aria-label="Edit customer"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="action-button delete-button"
                          aria-label="Delete customer"
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

      {(isAddingCustomer || editingCustomer) && (
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setEditingCustomer(null);
            setIsAddingCustomer(false);
          }}
          initialData={editingCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
