export interface User {
  id: number;
  username: string;
  password: string;
  email: string | null;
  role: UserRole | null;
  first_name: string | null;
  last_name: string | null;
  created_at: Date | null;
  last_login: Date | null;
}

export type UserRole = 'admin' | 'user' | 'manager';

export interface Product {
  id: number;
  name: string;
  category_id: number;
  supplier_id: number;
  price: number;
  stock: number;
  barcode: string;
  description: string;
  image_url: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  parent_id: number | null;
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
  loyalty_points: number | null;
  created_at: string;
}

export interface InventoryForecast {
  id: number;
  product_id: number | null;
  current_stock: number;
  projected_demand: number | null;
  recommended_reorder_quantity: number | null;
  reorder_point: number | null;
  projected_stock_out_date: Date | null;
  forecast_period: string | null;
  confidence_level: number | null;
  created_at: Date | null;
}

export interface Sale {
  id: number;
  customer_id: number | null;
  date: string;
  total: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string | null;
  customer?: Customer;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price: number;
  discount: number | null;
  subtotal: number;
  product?: Product;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  supplier?: {
    name: string;
  };
  date: string;
  expected_delivery_date: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  total_cost: number;
  remarks: string | null;
  purchase_order_items: {
    id: any;
    purchase_order_id: any;
    product_id: any;
    price: any;
    received_quantity: any;
    status: any;
    quantity: number;
    product: {
      id: any;
      name: string;
      image_url: string;
    };
  }[];
}

export interface PurchaseOrderItem {
  id: number;
  purchase_order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  received_quantity: number | null;
  status: 'pending' | 'received' | 'backordered' | null;
}

export interface NewSale {
  customer_id: number | null;
  total: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string | null;
  items: Omit<SaleItem, 'id' | 'sale_id'>[];
}

export interface ProductFormData {
  name: string;
  category_id: string | number;
  supplier_id: string | number;
  price: number | string;
  stock: number | string;
  barcode?: string;
  description?: string;
  image_url?: string;
}
