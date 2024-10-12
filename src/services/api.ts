import { Product, Category, Supplier, Sale, PurchaseOrder, Customer } from '../types';

// Simulated delay to mimic API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiService {
  private storage: {
    products: Product[];
    categories: Category[];
    suppliers: Supplier[];
    sales: Sale[];
    purchaseOrders: PurchaseOrder[];
    customers: Customer[];
  };

  constructor() {
    this.storage = {
      products: [],
      categories: [],
      suppliers: [],
      sales: [],
      purchaseOrders: [],
      customers: [],
    };
  }

  private saveToStorage() {
    Object.entries(this.storage).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  }

  private loadFromStorage() {
    Object.keys(this.storage).forEach((key) => {
      const data = localStorage.getItem(key);
      if (data) {
        this.storage[key] = JSON.parse(data);
      }
    });
  }

  private generateUniqueId(): number {
    return Date.now() * 1000 + Math.floor(Math.random() * 1000);
  }

  // Products
  async getProducts(): Promise<Product[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.products;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const newProduct = { ...product, id: this.generateUniqueId() };
    this.storage.products.push(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  async updateProduct(id: number, product: Omit<Product, 'id'>): Promise<Product> {
    await delay(300);
    const index = this.storage.products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...product, id };
    this.storage.products[index] = updatedProduct;
    this.saveToStorage();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await delay(300);
    this.storage.products = this.storage.products.filter(p => p.id !== id);
    this.saveToStorage();
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.categories;
  }

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    await delay(300);
    const newCategory = { ...category, id: this.generateUniqueId() };
    this.storage.categories.push(newCategory);
    this.saveToStorage();
    return newCategory;
  }

  async updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category> {
    await delay(300);
    const index = this.storage.categories.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Category not found');
    }
    const updatedCategory = { ...category, id };
    this.storage.categories[index] = updatedCategory;
    this.saveToStorage();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await delay(300);
    this.storage.categories = this.storage.categories.filter(c => c.id !== id);
    this.saveToStorage();
  }

  // Suppliers
  async getSuppliers(): Promise<Supplier[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.suppliers;
  }

  async addSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    await delay(300);
    const newSupplier = { ...supplier, id: this.generateUniqueId() };
    this.storage.suppliers.push(newSupplier);
    this.saveToStorage();
    return newSupplier;
  }

  async updateSupplier(id: number, supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    await delay(300);
    const index = this.storage.suppliers.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    const updatedSupplier = { ...supplier, id };
    this.storage.suppliers[index] = updatedSupplier;
    this.saveToStorage();
    return updatedSupplier;
  }

  async deleteSupplier(id: number): Promise<void> {
    await delay(300);
    this.storage.suppliers = this.storage.suppliers.filter(s => s.id !== id);
    this.saveToStorage();
  }

  // Customers
  async getCustomers(): Promise<Customer[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.customers;
  }

  async addCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    await delay(300);
    const newCustomer = { ...customer, id: this.generateUniqueId() };
    this.storage.customers.push(newCustomer);
    this.saveToStorage();
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Omit<Customer, 'id'>): Promise<Customer> {
    await delay(300);
    const index = this.storage.customers.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }
    const updatedCustomer = { ...customer, id };
    this.storage.customers[index] = updatedCustomer;
    this.saveToStorage();
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<void> {
    await delay(300);
    this.storage.customers = this.storage.customers.filter(c => c.id !== id);
    this.saveToStorage();
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.sales;
  }

  async addSale(sale: Omit<Sale, 'id'>): Promise<Sale> {
    await delay(300);
    const newSale = { ...sale, id: this.generateUniqueId() };
    this.storage.sales.push(newSale);
    this.saveToStorage();
    return newSale;
  }

  // Purchase Orders
  async getPurchaseOrders(): Promise<PurchaseOrder[]> {
    await delay(300);
    this.loadFromStorage();
    return this.storage.purchaseOrders;
  }

  async addPurchaseOrder(order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    await delay(300);
    const newOrder = { ...order, id: this.generateUniqueId() };
    this.storage.purchaseOrders.push(newOrder);
    this.saveToStorage();
    return newOrder;
  }

  async updatePurchaseOrder(id: number, order: Omit<PurchaseOrder, 'id'>): Promise<PurchaseOrder> {
    await delay(300);
    const index = this.storage.purchaseOrders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Purchase order not found');
    }
    const updatedOrder = { ...order, id };
    this.storage.purchaseOrders[index] = updatedOrder;
    this.saveToStorage();
    return updatedOrder;
  }

  async deletePurchaseOrder(id: number): Promise<void> {
    await delay(300);
    this.storage.purchaseOrders = this.storage.purchaseOrders.filter(o => o.id !== id);
    this.saveToStorage();
  }
}

export const api = new ApiService();