import React, { useState, useMemo } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useSuppliers } from '../hooks/useSuppliers';
import { useProducts } from '../hooks/useProducts';
import { ArrowUpDown, Search } from 'lucide-react';

const PurchaseOrderReport: React.FC = () => {
  const { purchaseOrders } = usePurchaseOrders();
  const { suppliers } = useSuppliers();
  const { products } = useProducts();

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });
  const [filterSupplier, setFilterSupplier] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const sortedAndFilteredOrders = useMemo(() => {
    if (!hasSearched) return [];

    let filteredOrders = purchaseOrders.filter(order => {
      const matchesSupplier = !filterSupplier || order.supplierId.toString() === filterSupplier;
      const orderDate = new Date(order.date);
      const matchesDateFrom = !filterDateFrom || orderDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || orderDate <= new Date(filterDateTo);
      const matchesSearch = searchTerm.toLowerCase().split(' ').every(term =>
        order.productName.toLowerCase().includes(term) ||
        order.supplierName.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        order.remarks.toLowerCase().includes(term)
      );
      return matchesSupplier && matchesDateFrom && matchesDateTo && matchesSearch;
    });

    return filteredOrders.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [purchaseOrders, sortConfig, filterSupplier, filterDateFrom, filterDateTo, searchTerm, hasSearched]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  const handleSearch = () => {
    setHasSearched(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Purchase Order Report</h2>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filterSupplier}
          onChange={(e) => setFilterSupplier(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Suppliers</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id.toString()}>{supplier.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={filterDateFrom}
          onChange={(e) => setFilterDateFrom(e.target.value)}
          className="p-2 border rounded"
          placeholder="From Date"
        />
        <input
          type="date"
          value={filterDateTo}
          onChange={(e) => setFilterDateTo(e.target.value)}
          className="p-2 border rounded"
          placeholder="To Date"
        />
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
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('date')}>
                Date {sortConfig.key === 'date' && <ArrowUpDown className="inline" size={16} />}
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('supplierName')}>
                Supplier {sortConfig.key === 'supplierName' && <ArrowUpDown className="inline" size={16} />}
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('productName')}>
                Product {sortConfig.key === 'productName' && <ArrowUpDown className="inline" size={16} />}
              </th>
              <th className="py-3 px-6 text-center cursor-pointer" onClick={() => handleSort('quantity')}>
                Quantity {sortConfig.key === 'quantity' && <ArrowUpDown className="inline" size={16} />}
              </th>
              <th className="py-3 px-6 text-center cursor-pointer" onClick={() => handleSort('status')}>
                Status {sortConfig.key === 'status' && <ArrowUpDown className="inline" size={16} />}
              </th>
              <th className="py-3 px-6 text-left">Remarks</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedAndFilteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(order.date).toLocaleString()}
                </td>
                <td className="py-3 px-6 text-left">{order.supplierName}</td>
                <td className="py-3 px-6 text-left">{order.productName}</td>
                <td className="py-3 px-6 text-center">{order.quantity}</td>
                <td className="py-3 px-6 text-center">{order.status}</td>
                <td className="py-3 px-6 text-left">{order.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PurchaseOrderReport;