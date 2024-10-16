import React, { useState, useMemo } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useSuppliers } from '../hooks/useSuppliers';
import { useProducts } from '../hooks/useProducts';
import { ArrowUpDown } from 'lucide-react';
import { PurchaseOrder } from '../types';

type SortConfig = {
  key: keyof PurchaseOrder;
  direction: 'ascending' | 'descending';
};

const PurchaseOrderReport: React.FC = () => {
  const { purchaseOrders } = usePurchaseOrders();
  const { suppliers } = useSuppliers();
  const { products } = useProducts();

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });
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
      const matchesSearch = !searchTerm || searchTerm.toLowerCase().split(' ').every(term =>
        products.find(p => p.id === order.productId)?.name.toLowerCase().includes(term) ||
        suppliers.find(s => s.id === order.supplierId)?.name.toLowerCase().includes(term) ||
        order.status.toLowerCase().includes(term) ||
        (order.remarks && order.remarks.toLowerCase().includes(term))
      );
      return matchesSupplier && matchesDateFrom && matchesDateTo && matchesSearch;
    });

    return filteredOrders.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (valueB == null) return sortConfig.direction === 'ascending' ? 1 : -1;
      if (valueA && valueB && valueA < valueB) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (valueA && valueB && valueA > valueB) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [purchaseOrders, sortConfig, filterSupplier, filterDateFrom, filterDateTo, searchTerm, hasSearched, products, suppliers]);

  const handleSort = (key: keyof PurchaseOrder) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Purchase Order Report</h2>
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('date')}>
              Date {sortConfig.key === 'date' && <ArrowUpDown className="inline" size={16} />}
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('supplierId')}>
              Supplier {sortConfig.key === 'supplierId' && <ArrowUpDown className="inline" size={16} />}
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('productId')}>
              Product {sortConfig.key === 'productId' && <ArrowUpDown className="inline" size={16} />}
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
              <td className="py-3 px-6 text-left">{suppliers.find(s => s.id === order.supplierId)?.name}</td>
              <td className="py-3 px-6 text-left">{products.find(p => p.id === order.productId)?.name}</td>
              <td className="py-3 px-6 text-center">{order.quantity}</td>
              <td className="py-3 px-6 text-center">{order.status}</td>
              <td className="py-3 px-6 text-left">{order.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrderReport;
