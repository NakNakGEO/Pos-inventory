export interface User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  role: UserRole;
  firstName: string | null;
  lastName: string | null;
  createdAt: Date;
  lastLogin: Date | null;
}

export type UserRole = 'admin' | 'user' | 'manager';

export interface Product {
  id: number;
  name: string;
  categoryId: number | null;
  supplierId: number | null;
  price: number;
  stock: number;
  barcode: string | null;
  description: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  loyaltyPoints: number | null;
  createdAt: Date;
}

export interface InventoryForecast {
  productId: number;
  productName: string;
  currentStock: number;
  projectedDemand: number | null;
  recommendedReorderQuantity: number | null;
  reorderPoint: number | null;
  projectedStockOutDate: Date | null;
  forecastPeriod: string | null;
  confidenceLevel: number | null;
}

export interface Sale {
  productId: number;
  quantity: number;
  saleItems: any;
  id: number;
  customerId: number | null;
  date: string;
  total: number;
  paymentMethod: string | null;
  status: 'completed' | 'refunded' | 'cancelled';
  notes: string | null;
}

export interface PurchaseOrder {
  productName: string;
  supplierName: string;
  id: number;
  supplierId: number;
  productId: number;
  date: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  remarks?: string | null;
  expectedDeliveryDate: string | null;
  totalCost: number;
}

export interface SaleItem {
  id: number;
  saleId: number;
  productId: number;
  quantity: number;
  price: number;
  discount: number | null;
  subtotal: number;
}

export interface PurchaseOrderItem {
  id: number;
  purchaseOrderId: number;
  productId: number;
  quantity: number;
  price: number;
  receivedQuantity: number | null;
  status: 'pending' | 'received' | 'backordered';
}
