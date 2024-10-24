import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchSuppliers, fetchProducts, fetchPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder, markPurchaseOrderAsReceived } from '../services/api';
import api from '../services/api';
import { Supplier, Product, PurchaseOrder } from '../types';
import PurchaseOrderForm from '../components/PurchaseOrderForm';
import { Table, Button, Modal, Spin, message } from 'antd';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Plus, Package, Calendar, Truck, DollarSign, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const PurchaseOrders: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [suppliersData, setSuppliersData] = useState<Supplier[]>([]);
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [suppliers, products, orders] = await Promise.all([
        fetchSuppliers(),
        fetchProducts(),
        fetchPurchaseOrders()
      ]);
      setSuppliersData(suppliers || []);
      setProductsData(products || []);
      setPurchaseOrders(orders || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('purchaseOrders.supplier'),
      dataIndex: ['supplier', 'name'],
      key: 'supplier',
      render: (text: string, record: any) => record.supplier?.name || 'N/A',
    },
    {
      title: t('purchaseOrders.date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: t('purchaseOrders.expectedDelivery'),
      dataIndex: 'expected_delivery_date',
      key: 'expectedDelivery',
      render: (date: string) => format(new Date(date), 'dd/MM/yyyy'),
    },
    {
      title: t('purchaseOrders.product'),
      dataIndex: ['product', 'name'],
      key: 'product',
      render: (text: string, record: any) => record.product?.name || 'N/A',
    },
    {
      title: t('purchaseOrders.quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('purchaseOrders.totalCost'),
      dataIndex: 'total_cost',
      key: 'totalCost',
      render: (cost: number) => cost ? `$${cost.toFixed(2)}` : 'N/A',
    },
    {
      title: t('purchaseOrders.status'),
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const handleSubmit = async (values: any) => {
    try {
      const purchaseOrderData = {
        ...values,
        items: [
          {
            product_id: values.product_id,
            quantity: values.quantity,
            price: values.price
          }
        ]
      };
      console.log('Submitting purchase order data:', purchaseOrderData);
      if (editingOrder) {
        await updatePurchaseOrder(editingOrder.id, purchaseOrderData);
      } else {
        await addPurchaseOrder(purchaseOrderData);
      }
      setIsModalOpen(false);
      setEditingOrder(null);
      loadData(); // Refresh the data after creating or updating an order
    } catch (error) {
      console.error('Error submitting purchase order:', error);
      message.error('Failed to submit purchase order. Please try again.');
    }
  };

  const handleEdit = (order: PurchaseOrder) => {
    if (order.status === 'completed') {
      message.warning('Cannot edit a completed purchase order.');
      return;
    }
    const formattedOrder = {
      ...order,
      date: order.date ? new Date(order.date).toISOString().split('T')[0] : null,
      expected_delivery_date: order.expected_delivery_date 
        ? new Date(order.expected_delivery_date).toISOString().split('T')[0] 
        : null,
      product_id: order.purchase_order_items?.[0]?.product_id,
      quantity: order.purchase_order_items?.[0]?.quantity,
      price: order.purchase_order_items?.[0]?.price
    };
    setEditingOrder(formattedOrder);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(t('purchaseOrders.confirmDelete'))) {
      try {
        await deletePurchaseOrder(id);
        message.success('Purchase order deleted successfully');
        loadData();
      } catch (error) {
        console.error('Error deleting purchase order:', error);
        message.error('Failed to delete purchase order. Please try again.');
      }
    }
  };

  const handleReceived = async (id: number) => {
    try {
      await markPurchaseOrderAsReceived(id);
      message.success(t('purchaseOrders.receivedSuccess'));
      loadData(); // Refresh the data after marking as received
    } catch (error) {
      message.error(t('purchaseOrders.receivedError'));
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-800">{t('purchaseOrders.title')}</h1>
      <button 
        onClick={() => {
          setEditingOrder(null);
          setIsModalOpen(true);
        }}
        className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
      >
        {t('purchaseOrders.addNew')}
      </button>

      <div className="overflow-x-auto shadow-md rounded-lg" style={{ maxHeight: 'calc(100vh - 250px)' }}>
        <table className="w-full table-auto">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.supplier')}</th>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.date')}</th>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.expectedDelivery')}</th>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.product')}</th>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.quantity')}</th>
              <th className="px-4 py-2 text-left">{t('purchaseOrders.image')}</th>
              <th className="px-4 py-2 text-left sticky right-0 bg-purple-400">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((order, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border px-4 py-2">{order.supplier?.name}</td>
                <td className="border px-4 py-2">{format(new Date(order.date), 'dd/MM/yyyy')}</td>
                <td className="border px-4 py-2">{format(new Date(order.expected_delivery_date), 'dd/MM/yyyy')}</td>
                <td className="border px-4 py-2">{order.purchase_order_items?.[0]?.product?.name}</td>
                <td className="border px-4 py-2">{order.purchase_order_items?.[0]?.quantity}</td>
                <td className="border px-4 py-2">
                  <img src={order.purchase_order_items?.[0]?.product?.image_url} alt={order.purchase_order_items?.[0]?.product?.name} className="w-16 h-16 object-cover" />
                </td>
                <td className="border px-4 py-2 sticky right-0 bg-purple-200">
                  <div className="flex space-x-2">
                  <button 
                      onClick={() => handleDelete(order.id)}
                      className="action-button delete-button"
                    >
                      <Trash2 size={16} />
                    </button>
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => handleEdit(order)}
                        className="action-button edit-button"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    {order.status !== 'completed' && (
                      <button 
                        onClick={() => handleReceived(order.id)}
                        className="action-button bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Truck size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingOrder ? t('purchaseOrders.edit') : t('purchaseOrders.addNew')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingOrder(null);
        }}
        footer={null}
      >
        <PurchaseOrderForm 
          onSubmit={handleSubmit} 
          suppliers={suppliersData} 
          products={productsData}
          initialData={editingOrder}
        />
      </Modal>
    </div>
  );
};

export default PurchaseOrders;
