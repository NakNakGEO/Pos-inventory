import React, { useState, useCallback, useMemo } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders';
import { useProducts } from '../hooks/useProducts';
import { useSuppliers } from '../hooks/useSuppliers';
import { Trash2, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { handleApiError } from '../utils/errorHandling';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../components/ErrorMessage';
import { PurchaseOrder, PurchaseOrderItem } from '../types';

const purchaseOrderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier is required'),
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  remarks: z.string().optional(),
});

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>;

const PurchaseOrders: React.FC = () => {
  const { t } = useTranslation();
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrder } = usePurchaseOrders();
  const { products } = useProducts();
  const { suppliers } = useSuppliers();
  const [error, setError] = useState<string | null>(null);

  const { handleSubmit, reset } = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
  });

  const onSubmit = useCallback(async (data: PurchaseOrderFormData) => {
    try {
      const supplier = suppliers.find(s => s.id === parseInt(data.supplierId));
      const product = products.find(p => p.id === parseInt(data.productId));
      if (!supplier || !product) {
        throw new Error('Invalid supplier or product');
      }
      const order: Omit<PurchaseOrder, 'id'> = {
        supplierId: supplier.id,
        date: new Date().toISOString(),
        status: 'pending',
        productId: 0,
        quantity: 0,
        expectedDeliveryDate: null,
        totalCost: 0,
        productName: '',
        supplierName: ''
      };
      const orderItem: Omit<PurchaseOrderItem, 'id'> = {
        productId: product.id,
        quantity: data.quantity,
        price: product.price,
        status: 'received',
        purchaseOrderId: 0,
        receivedQuantity: null
      };
      await addPurchaseOrder(order, [orderItem]);
      reset();
    } catch (error) {
      setError(handleApiError(error));
    }
  }, [suppliers, products, addPurchaseOrder, reset, setError]);

  const handleReceive = useCallback(async (orderId: number) => {
    try {
      const order = purchaseOrders.find(o => o.id === orderId);
      if (order) {
        const product = products.find(p => p.id === order.productId);
        if (product) {
          await updateProduct(product.id, { ...product, stock: product.stock + order.quantity });
          await updatePurchaseOrder(orderId, { ...order, status: 'completed' });
        }
      }
    } catch (error) {
      setError(handleApiError(error));
    }
  }, [purchaseOrders, products, updateProduct, updatePurchaseOrder, setError]);

  const sortedPurchaseOrders = useMemo(() => 
    [...purchaseOrders].sort((a, b) => b.id - a.id),
    [purchaseOrders]
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">{t('purchaseOrders.title')}</h1>
      <ErrorMessage error={error} />
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        {/* Form fields */}
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">{t('purchaseOrders.productName')}</th>
              <th className="py-3 px-6 text-left">{t('purchaseOrders.supplier')}</th>
              <th className="py-3 px-6 text-center">{t('purchaseOrders.quantity')}</th>
              <th className="py-3 px-6 text-left">{t('purchaseOrders.status')}</th>
              <th className="py-3 px-6 text-left">{t('purchaseOrders.actions')}</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sortedPurchaseOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <span className="font-medium">{order.productName}</span>
                </td>
                <td className="py-3 px-6 text-left">{order.supplierName}</td>
                <td className="py-3 px-6 text-center">{order.quantity}</td>
                <td className="py-3 px-6 text-left">{order.status}</td>
                <td className="py-3 px-6 text-left">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleReceive(order.id)}
                      aria-label={t('purchaseOrders.receiveOrder', { id: order.id })}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors mr-2"
                    >
                      <CheckCircle size={20} />
                    </button>
                  )}
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

function updateProduct(id: any, arg1: any) {
  throw new Error('Function not implemented.');
}
