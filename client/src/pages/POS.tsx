import React, { useState, useMemo, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { Search, Plus, Minus, Trash2 } from 'lucide-react';
import { handleApiError } from '../utils/errorHandling';
import { useTranslation } from 'react-i18next';
import ErrorMessage from '../components/ErrorMessage';
import { Sale } from '../types';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}



const POS: React.FC = () => {
  const { products, error: productsError } = useProducts();
  const { error: categoriesError } = useCategories();
  const { customers, error: customersError } = useCustomers();
  const { addSale, error: saleError } = useSales();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [manualCustomerName, setManualCustomerName] = useState('');
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const filteredProducts = useMemo(() => 
    products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [products, searchTerm]
  );


  const addToCart = useCallback((productId: number) => {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === productId);
        if (existingItem) {
          return prevCart.map(item =>
            item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        } else {
          return [...prevCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
        }
      });
    }
  }, [products]);


  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);


  const updateCartItemQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity > 0) {
      setCart(prevCart => prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    } else {
      removeFromCart(productId);
    }
  }, [removeFromCart]);


  const subtotal = useMemo(() => 
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );


  const total = useMemo(() => subtotal, [subtotal]);

  const customerInfo = useMemo(() => {
    if (selectedCustomer) {
      const customer = customers.find(c => c.id === selectedCustomer);
      return customer ? customer.name : 'Unknown Customer';
    }
    return manualCustomerName || 'Walk-in Customer';
  }, [selectedCustomer, customers, manualCustomerName]);


  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      const saleData = {
        date: new Date().toISOString(),
        customerId: selectedCustomer || 0,
        customerName: selectedCustomer ? customers.find(c => c.id === selectedCustomer)?.name || '' : manualCustomerName,
        saleItems: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        total: total,
        paymentMethod: paymentMethod,
        status: 'completed' as const,
        notes: '',
      };
      await addSale(saleData as unknown as Omit<Sale, 'id'>, cart.map(item => ({
        saleId: 0,
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
        discount: null,
      })));

      const stockUpdatePromises = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }
        return updateProduct(product.id, { ...product, stock: product.stock - item.quantity });
      });


      await Promise.all(stockUpdatePromises);

      // Reset cart and form
      setCart([]);
      setPaymentMethod('cash');
      setSelectedCustomer(null);
      setManualCustomerName('');
      setError(null);
    } catch (error) {
      setError(handleApiError(error));
    }
  }, [cart, selectedCustomer, customers, manualCustomerName, total, paymentMethod, addSale, products, updateProduct]);

  const errorMessage = useMemo(() => {
    if (productsError) return handleApiError(productsError);
    if (categoriesError) return handleApiError(categoriesError);
    if (customersError) return handleApiError(customersError);
    if (saleError) return handleApiError(saleError);
    return null;
  }, [productsError, categoriesError, customersError, saleError]);

  return (
    <div>
      <h1>{t('pos.title')}</h1>
      <ErrorMessage error={error || errorMessage} />
      
      <div role="search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('pos.searchPlaceholder')}
          aria-label={t('pos.searchLabel')}
        />
      </div>
      
      <div role="region" aria-label={t('pos.productList')}>
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => addToCart(product.id)}
            disabled={product.stock === 0}
            aria-label={t('pos.addToCart', { name: product.name })}
          >
            {product.name} - ${product.price.toFixed(2)}
          </button>
        ))}
      </div>
      
      <div role="region" aria-label={t('pos.cart')}>
        <h2>{t('pos.cart')}</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity}
              <button
                onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                aria-label={t('pos.decreaseQuantity', { name: item.name })}
              >
                <Minus size={18} />
              </button>
              <button
                onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                aria-label={t('pos.increaseQuantity', { name: item.name })}
              >
                <Plus size={18} />
              </button>
              <button
                onClick={() => removeFromCart(item.id)}
                aria-label={t('pos.removeFromCart', { name: item.name })}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
        <p>{t('pos.total')}: ${total.toFixed(2)}</p>
        <p>{t('pos.customer')}: {customerInfo}</p>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          aria-label={t('pos.selectPaymentMethod')}
        >
          <option value="cash">{t('pos.cash')}</option>
          <option value="card">{t('pos.card')}</option>
        </select>
        <button 
          onClick={handleCheckout}
          aria-label={t('pos.proceedToCheckout')}
        >
          {t('pos.checkout')}
        </button>
      </div>
    </div>
  );
};


export default POS;
function updateProduct(id: any, arg1: any): any {
  throw new Error('Function not implemented.');
}

