import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSuppliers } from '../hooks/useSuppliers';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Package, Edit, Trash2 } from 'lucide-react';
import { Product } from '../types';
import ProductForm from '../components/ProductForm';
import ErrorMessage from '../components/ErrorMessage';
import { handleApiError } from '../utils/errorHandling';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const Products: React.FC = () => {
  const { products, loading, error: productsError, deleteProduct, addProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (categories.find(c => c.id === product.category_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (suppliers.find(s => s.id === product.supplier_id)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, categories, suppliers, searchTerm]
  );

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteProduct(id);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  }, [deleteProduct]);

  const handleSubmit = async (formData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
      } else {
        await addProduct(formData);
      }
      setShowForm(false);
      setEditingProduct(null);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('products.title')}</h1>
      
      <ErrorMessage error={error || productsError} />
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="card-header">
            <CardTitle className="title-3d flex items-center">
              <Package className="mr-2" size={24} />
              {t('products.productOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
            <div className="flex items-center mb-4">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('products.searchPlaceholder')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">{t('products.name')}</th>
                    <th className="py-3 px-6 text-left">{t('products.category')}</th>
                    <th className="py-3 px-6 text-left">{t('products.supplier')}</th>
                    <th className="py-3 px-6 text-right">{t('products.price')}</th>
                    <th className="py-3 px-6 text-right">{t('products.stock')}</th>
                    <th className="py-3 px-6 text-right">{t('products.actions')}</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                      <td className="py-4 px-6 text-left whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <img 
                              src={product.image_url || '/placeholder-image.png'} 
                              alt={product.name} 
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-left">{categories.find(c => c.id === product.category_id)?.name}</td>
                      <td className="py-4 px-6 text-left">{suppliers.find(s => s.id === product.supplier_id)?.name}</td>
                      <td className="py-4 px-6 text-right">${product.price.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right">{product.stock}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2 action-buttons-container">
                          <button 
                            onClick={() => handleEdit(product)} 
                            className="action-button edit-button"
                            aria-label="Edit product"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)} 
                            className="action-button delete-button"
                            aria-label="Delete product"
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
      </div>

      <button 
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center"
      >
        <Plus size={20} className="mr-2" />
        {t('products.addProduct')}
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader className="card-header">
              <CardTitle className="title-3d">
                {editingProduct ? t('products.editProduct') : t('products.addProduct')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white rounded-b-lg">
              <ProductForm
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                initialData={editingProduct || undefined}
                categories={categories}
                suppliers={suppliers}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Products;
