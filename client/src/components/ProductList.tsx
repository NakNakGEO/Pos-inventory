import React from 'react';
import { Product, Category, Supplier } from '../types'; // Make sure to import these types

interface ProductListProps {
  products: Product[];
  categories: Category[];
  suppliers: Supplier[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, categories, suppliers, onEdit, onDelete }) => {
  // Component logic here
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2 px-4 border-b">Name</th>
          <th className="py-2 px-4 border-b">Category</th>
          <th className="py-2 px-4 border-b">Supplier</th>
          <th className="py-2 px-4 border-b">Price</th>
          <th className="py-2 px-4 border-b">Stock</th>
          <th className="py-2 px-4 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
            <td className="py-2 px-4">{product.name}</td>
            <td className="py-2 px-4">{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</td>
            <td className="py-2 px-4">{suppliers.find(s => s.id === product.supplierId)?.name || 'N/A'}</td>
            <td className="py-2 px-4">${product.price.toFixed(2)}</td>
            <td className="py-2 px-4">{product.stock}</td>
            <td className="py-2 px-4">
              <button onClick={() => onEdit(product)} className="mr-2 text-blue-500">Edit</button>
              <button onClick={() => onDelete(product.id)} className="text-red-500">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
