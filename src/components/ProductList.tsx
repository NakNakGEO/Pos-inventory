import React from 'react';
import { Table, Package, Edit, Trash } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  categoryId: number;
  supplierId: number;
  price: number;
  stock: number;
  productId?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

interface ProductListProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, categories, suppliers, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Product ID</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Supplier</th>
            <th className="py-3 px-6 text-center">Price</th>
            <th className="py-3 px-6 text-center">Stock</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {products.map((product) => (
            <tr key={`product-${product.id}`} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <Package className="mr-2" size={18} />
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">{product.productId || 'N/A'}</td>
              <td className="py-3 px-6 text-left">
                {categories.find(c => c.id === product.categoryId)?.name}
              </td>
              <td className="py-3 px-6 text-left">
                {suppliers.find(s => s.id === product.supplierId)?.name}
              </td>
              <td className="py-3 px-6 text-center">${product.price.toFixed(2)}</td>
              <td className="py-3 px-6 text-center">{product.stock}</td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  <button
                    onClick={() => onEdit(product)}
                    className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(product.id)}
                    className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;