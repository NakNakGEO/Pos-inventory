export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'user';

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  supplierId: number;
  price: number;
  stock: number;
  barcode: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
}