import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { Search, ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import ReceiptModal from '../components/ReceiptModal';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const POS: React.FC = () => {
  const { products, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { customers } = useCustomers();
  const { addSale } = useSales();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const filteredProducts = products.filter(product =>
    (selectedCategory ? product.categoryId === selectedCategory : true) &&
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      const existingItem = cart.find(item => item.id === productId);
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }]);
      }
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      removeFromCart(productId);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal - discount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    const customerInfo = selectedCustomer
      ? customers.find(c => c.id === selectedCustomer)?.name
      : manualCustomerName || 'Walk-in Customer';

    const saleData = {
      date: new Date().toISOString(),
      customerId: selectedCustomer,
      customerName: customerInfo,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total,
      paymentMethod: paymentMethod,
    };

    try {
      await addSale(saleData);

      // Update product stock
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await updateProduct(product.id, { ...product, stock: product.stock - item.quantity });
        }
      }

      setReceiptData({
        items: cart,
        total: total,
        paymentMethod: paymentMethod,
        date: new Date().toLocaleString(),
        customerName: customerInfo,
      });

      setShowReceiptModal(true);

      // Reset cart and form
      setCart([]);
      setDiscount(0);
      setPaymentMethod('cash');
      setSelectedCustomer(null);
      setManualCustomerName('');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="mb-4 flex space-x-2">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            />
            <div className="absolute left-3 top-2 text-gray-400">
              <Search size={20} />
            </div>
          </div>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-semibold">{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <button
                onClick={() => addToCart(product.id)}
                className="mt-2 bg-blue-500 text-white px-2 py-1 rounded"
                disabled={product.stock === 0}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Cart</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded">
            <span className="font-medium">{item.name}</span>
            <div className="flex items-center">
              <button
                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-l"
              >
                <Minus size={16} />
              </button>
              <span className="px-2">{item.quantity}</span>
              <button
                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded-r"
              >
                <Plus size={16} />
              </button>
              <span className="mx-2">${(item.price * item.quantity).toFixed(2)}</span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        <div className="mt-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span>Discount:</span>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-20 p-1 border rounded"
            />
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="mt-4">
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="cash">Cash</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
          </select>
        </div>
        <div className="mt-4">
          <select
            value={selectedCustomer || ''}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedCustomer(value ? Number(value) : null);
              setManualCustomerName('');
            }}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select Customer (Optional)</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
          {!selectedCustomer && (
            <input
              type="text"
              value={manualCustomerName}
              onChange={(e) => setManualCustomerName(e.target.value)}
              placeholder="Or enter customer name manually"
              className="w-full p-2 border rounded"
            />
          )}
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition-colors"
          disabled={cart.length === 0}
        >
          Complete Sale
        </button>
      </div>
      {showReceiptModal && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          receiptData={receiptData}
        />
      )}
    </div>
  );
};

export default POS;