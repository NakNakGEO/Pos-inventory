import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSuppliers } from '../hooks/useSuppliers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleApiError } from '../utils/errorHandling';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../components/ErrorMessage';
import { Product } from '../types';
import api from '../services/api';

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
const Products: React.FC = () => {
  const { products, fetchProducts } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/products/${id}`);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      await api.post('/products', product);
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: number, product: Omit<Product, 'id'>) => {
    try {
      await api.put(`/products/${id}`, product);
      await fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editingProduct || undefined,
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data as unknown as Omit<Product, 'id'>);
      } else {
        await addProduct(data as unknown as Omit<Product, 'id'>);
      }
      reset();
      setEditingProduct(null);
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteProduct(id);
    } catch (error) {
      setError(handleApiError(error));
    }
  }, [deleteProduct]);

  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories.find(c => c.id === product.categoryId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (suppliers.find(s => s.id === product.supplierId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, categories, suppliers, searchTerm]
  );

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div>
      <h1>{t('products.title')}</h1>
      <ErrorMessage error={error} />
      <button 
        onClick={() => setShowForm(true)} 
        aria-label={t('products.addProduct')}
      >
        {t('products.addProduct')}
      </button>
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('products.searchPlaceholder')}
        aria-label={t('products.searchLabel')}
      />
      
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input {...register('name')} placeholder="Name" />
          {errors.name && <span>{errors.name.message}</span>}
          <select {...register('categoryId', { valueAsNumber: true })}>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.categoryId && <span>{errors.categoryId.message}</span>}
          <select {...register('supplierId', { valueAsNumber: true })}>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
          {errors.supplierId && <span>{errors.supplierId.message}</span>}
          <input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="Price" />
          {errors.price && <span>{errors.price.message}</span>}
          <input {...register('stock', { valueAsNumber: true })} type="number" placeholder="Stock" />
          {errors.stock && <span>{errors.stock.message}</span>}
          <input {...register('barcode')} placeholder="Barcode" />
          {errors.barcode && <span>{errors.barcode.message}</span>}
          <textarea {...register('description')} placeholder="Description" />
          <input {...register('imageUrl')} placeholder="Image URL" />
          <button type="submit">{editingProduct ? 'Update Product' : 'Add Product'}</button>
          <button type="button" onClick={() => {
            setShowForm(false);
            setEditingProduct(null);
            reset();
          }}>Cancel</button>
        </form>
      )}
      
      <table aria-label={t('products.tableLabel')}>
        <thead>
          <tr>
            <th scope="col">{t('products.name')}</th>
            <th scope="col">{t('products.category')}</th>
            <th scope="col">{t('products.supplier')}</th>
            <th scope="col">{t('products.price')}</th>
            <th scope="col">{t('products.stock')}</th>
            <th scope="col">{t('products.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{categories.find(c => c.id === product.categoryId)?.name}</td>
              <td>{suppliers.find(s => s.id === product.supplierId)?.name}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.stock}</td>
              <td>
                <button 
                  onClick={() => handleEdit(product)} 
                  aria-label={t('products.editProduct', { name: product.name })}
                >
                  {t('products.edit')}
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  aria-label={t('products.deleteProduct', { name: product.name })}
                >
                  {t('products.delete')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;