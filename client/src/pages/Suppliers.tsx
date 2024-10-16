import React, { useState } from 'react';
import { useSuppliers } from '../hooks/useSuppliers';
import { Supplier } from '../types';
import { Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ErrorMessage from '../components/ErrorMessage';

const Suppliers: React.FC = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useSuppliers();
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supplierSchema = z.object({
    name: z.string().min(1, "Supplier name is required"),
    contact: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.string().optional(),
    phone: z.string().optional(),
  });

  type SupplierFormData = z.infer<typeof supplierSchema>;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contact: '',
      email: '',
      address: '',
      phone: '',
    },
  });
  
  const onSubmit = async (data: SupplierFormData) => {
    try {
      const supplierData = {
        ...data,
        contact: data.contact || null,
        email: data.email || null,
        address: data.address || null,
        phone: data.phone || null
      };

      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, supplierData as unknown as Omit<Supplier, 'id'>);
      } else {
        await addSupplier(supplierData as unknown as Omit<Supplier, 'id'>);
      }
      reset();
      setEditingSupplier(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    reset({
      name: supplier.name,
      contact: supplier.contact || '',
      email: supplier.email || '',
      address: supplier.address || '',
      phone: supplier.phone || ''
    });
    setError(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteSupplier(id);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Suppliers</h1>
      <ErrorMessage error={error} />
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          {...register('name')}
          placeholder="Supplier Name"
          className="mr-2 p-2 border rounded"
        />
        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        <input
          {...register('contact')}
          placeholder="Contact Information"
          className="mr-2 p-2 border rounded"
        />
        <input
          {...register('email')}
          placeholder="Email"
          className="mr-2 p-2 border rounded"
        />
        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
        <input
          {...register('address')}
          placeholder="Address"
          className="mr-2 p-2 border rounded"
        />
        <input
          {...register('phone')}
          placeholder="Phone"
          className="mr-2 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Contact</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier: Supplier) => (
            <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-2 px-4">{supplier.name}</td>
              <td className="py-2 px-4">{supplier.contact}</td>
              <td className="py-2 px-4">{supplier.email}</td>
              <td className="py-2 px-4">{supplier.address}</td>
              <td className="py-2 px-4">{supplier.phone}</td>
              <td className="py-2 px-4">
                <button onClick={() => handleEdit(supplier)} className="mr-2 text-blue-500">
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDelete(supplier.id)} className="text-red-500">
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

export default Suppliers;
