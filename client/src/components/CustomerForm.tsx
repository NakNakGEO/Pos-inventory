import React, { useState, useEffect } from 'react';
import { Customer } from '../types';

interface CustomerFormProps {
  onSubmit: (data: Omit<Customer, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  initialData?: Customer | null;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    loyalty_points: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        phone: initialData.phone || '',
        address: initialData.address || '',
        loyalty_points: initialData.loyalty_points || 0,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'loyalty_points' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="email" type="email" required placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
      <input name="loyalty_points" type="number" placeholder="Loyalty Points" value={formData.loyalty_points} onChange={handleChange} />
      <button type="submit">{initialData ? 'Update' : 'Add'} Customer</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default CustomerForm;
