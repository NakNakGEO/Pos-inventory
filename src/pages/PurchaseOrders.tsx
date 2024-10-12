import React, { useState } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { Trash2, CheckCircle } from 'lucide-react';

const PurchaseOrders: React.FC = () => {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder, removePurchaseOrder } = usePurchaseOrders();
  const { products, updateProduct } = useProducts();
  const { suppliers } = useSuppliers();
  const [newOrder, setNewOrder] = useState({
    supplierId: '',
    productId: '',
    quantity: '',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === parseInt(newOrder.supplierId));
    const product = products.find(p => p.id === parseInt(newOrder.productId));
    if (supplier && product) {
      const order = {
        id: Date.now(),
        supplierId: supplier.id,
        supplierName: supplier.name,
        productId: product.id,
        productName: product.name,
        productCode: product.productId || `P${String(product.id).padStart(4, '0')}`,
        quantity: parseInt(newOrder.quantity),
        status: 'pending' as const,
        remarks: newOrder.remarks,
      };
      addPurchaseOrder(order);
      setNewOrder({ supplierId: '', productId: '', quantity: '', remarks: '' });
    }
  };

  const handleReceive = (orderId: number) => {
    const order = purchaseOrders.find(o => o.id === orderId);
    if (order) {
      const product = products.find(p => p.id === order.productId);
      if (product) {
        updateProduct({ ...product, stock: product.stock + order.quantity });
        updatePurchaseOrder({ ...order, status: 'received' });
      }
    }
  };

  const handleRemove = (orderId: number) => {
    removePurchaseOrder(orderId);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Purchase Orders</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={newOrder.supplierId}
            onChange={(e) => setNewOrder({ ...newOrder, supplierId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
          </select>
          <select
            value={newOrder.productId}
            onChange={(e) => setNewOrder({ ...newOrder, productId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Product</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          <input
            type="number"
            value={newOrder.quantity}
            onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
            placeholder="Quantity"
            className="w-full p-2 border rounded"
            required
            min="1"
          />
          <input
            type="text"
            value={newOrder.remarks}
            onChange={(e) => setNewOrder({ ...newOrder, remarks: e.target.value })}
            placeholder="Remarks"
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
          Create Purchase Order
        </button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Product ID</th>
              <th className="py-3 px-6 text-center">Quantity</th>
              <th className="py-3 px-6 text-left">Supplier</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-left">Remarks</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {purchaseOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{order.productName}</span>
                </td>
                <td className="py-3 px-6 text-left">{order.productCode}</td>
                <td className="py-3 px-6 text-center">{order.quantity}</td>
                <td className="py-3 px-6 text-left">{order.supplierName}</td>
                <td className="py-3 px-6 text-center">
                  <span className={`font-semibold ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{order.remarks}</td>
                <td className="py-3 px-6 text-center">
                  <div className="flex item-center justify-center">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleReceive(order.id)}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors mr-2"
                        title="Receive Order"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemove(order.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                      title="Remove Order"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;