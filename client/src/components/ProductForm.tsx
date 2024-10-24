import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Category, Supplier, Product } from '../types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.number().min(1, 'Category is required'),
  supplierId: z.number().min(1, 'Supplier is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
  barcode: z.string().min(1, 'Barcode is required'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: Omit<Product, 'id'>) => void;
  onCancel: () => void;
  initialData?: Product;
  categories: Category[];
  suppliers: Supplier[];
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, onCancel, initialData, categories, suppliers }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    defaultValues: initialData || {
      name: '',
      categoryId: 0,
      supplierId: 0,
      price: 0,
      stock: 0,
      barcode: '',
      description: '',
      imageUrl: ''
    }
  });

  const onSubmitForm = (data: ProductFormData) => {
    const formattedData: Omit<Product, 'id'> = {
      name: data.name,
      category_id: Number(data.categoryId),
      supplier_id: Number(data.supplierId),
      price: Number(data.price),
      stock: Number(data.stock),
      barcode: data.barcode || '',
      description: data.description || '',
      image_url: data.imageUrl || '',
      created_at: new Date(),
      updated_at: new Date()
    };
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register('name')}
          id="name"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          {...register('categoryId', { valueAsNumber: true })}
          id="categoryId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
      </div>

      <div>
        <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700">Supplier</label>
        <select
          {...register('supplierId', { valueAsNumber: true })}
          id="supplierId"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        >
          <option value="">Select a supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
        {errors.supplierId && <p className="mt-1 text-sm text-red-600">{errors.supplierId.message}</p>}
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          {...register('price', { valueAsNumber: true })}
          id="price"
          type="number"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
      </div>

      <div>
        <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
        <input
          {...register('stock', { valueAsNumber: true })}
          id="stock"
          type="number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
      </div>

      <div>
        <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">Barcode</label>
        <input
          {...register('barcode')}
          id="barcode"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
        {errors.barcode && <p className="mt-1 text-sm text-red-600">{errors.barcode.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          id="description"
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        ></textarea>
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          {...register('imageUrl')}
          id="imageUrl"
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
