import React, { useState } from 'react';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSuppliers } from '../hooks/useSuppliers';
import { Search, Plus } from 'lucide-react';

const Products: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      setEditingProduct(null);
    } else {
      addProduct(data);
    }
    setShowForm(false);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (categories.find(c => c.id === product.categoryId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (suppliers.find(s => s.id === product.supplierId)?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Products</h1>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
          />
          <div className="absolute left-3 top-2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>
      {showForm && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingProduct}
          />
        </div>
      )}
      <ProductList
        products={filteredProducts}
        categories={categories}
        suppliers={suppliers}
        onEdit={(product) => {
          setEditingProduct(product);
          setShowForm(true);
        }}
        onDelete={deleteProduct}
      />
    </div>
  );
};

export default Products;