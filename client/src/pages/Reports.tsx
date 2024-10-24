import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSales } from '../hooks/useSales';
import { Search } from 'lucide-react';
import PurchaseOrderReport from '../components/PurchaseOrderReport';
import { Sale } from '../types';

const Reports: React.FC = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { sales } = useSales();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    const filtered = sales.filter(sale => {
      const product = products.find(p => p.id === sale.items[0].product_id);
      const category = product ? categories.find(c => c.id === product.category_id) : null;
      const saleDate = new Date(sale.date);

      return (
        (!startDate || saleDate >= new Date(startDate)) &&
        (!endDate || saleDate <= new Date(endDate)) &&
        (!selectedCategory || category?.id.toString() === selectedCategory) &&
        (!searchTerm || 
          (product && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (category && category.name.toLowerCase().includes(searchTerm.toLowerCase()))
      ));
    });

    setFilteredSales(filtered);
    setHasSearched(true);
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Reports</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Report</h2>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id.toString()}>{category.name}</option>
            ))}
          </select>
          <div className="flex">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-l flex-grow"
              placeholder="Search..."
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
        {hasSearched && (
          <>
            {filteredSales.length > 0 ? (
              <table className="min-w-full bg-white mb-8">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Date</th>
                    <th className="py-3 px-6 text-left">Product</th>
                    <th className="py-3 px-6 text-left">Category</th>
                    <th className="py-3 px-6 text-center">Quantity</th>
                    <th className="py-3 px-6 text-center">Total</th>
                    <th className="py-3 px-6 text-center">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {filteredSales.map((sale) => {
                    const product = products.find(p => p.id === sale.items[0].product_id);
                    const category = product ? categories.find(c => c.id === product.category_id) : null;
                    return (
                      <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                          {new Date(sale.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6 text-left">{product?.name || 'N/A'}</td>
                        <td className="py-3 px-6 text-left">{category?.name || 'N/A'}</td>
                        <td className="py-3 px-6 text-center">{sale.items[0].quantity}</td>
                        <td className="py-3 px-6 text-center">${sale.total.toFixed(2)}</td>
                        <td className="py-3 px-6 text-center">{sale.payment_method}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No results found.</p>
            )}
          </>
        )}
      </div>
      
      <PurchaseOrderReport />
    </div>
  );
};


export default Reports;