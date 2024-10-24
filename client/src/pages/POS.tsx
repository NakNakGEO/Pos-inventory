import React, { useState, useCallback, useMemo } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCustomers } from '../hooks/useCustomers';
import { useSales } from '../hooks/useSales';
import { useTranslation } from 'react-i18next';
import { Search, ShoppingCart, User, DollarSign } from 'lucide-react';
import { Product, Customer, Sale, SaleItem } from '../types';
import ErrorMessage from '../components/ErrorMessage';
import { handleApiError } from '../utils/errorHandling';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const POS: React.FC = () => {
  const { products, loading: productsLoading, error: productsError, updateProduct } = useProducts();
  const { customers, loading: customersLoading, error: customersError, addCustomer } = useCustomers();
  const { addSale, error: saleError } = useSales();
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [customerInput, setCustomerInput] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);

  const filteredProducts = useMemo(() => 
    products.filter(product => product && product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  );

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const total = useMemo(() => 
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const handleCheckout = async () => {
    try {
      let checkoutCustomer = selectedCustomer;

      if (!checkoutCustomer && customerInput.trim()) {
        const existingCustomer = customers.find(
          c => c.name.toLowerCase() === customerInput.trim().toLowerCase()
        );

        if (existingCustomer) {
          checkoutCustomer = existingCustomer;
        } else {
          checkoutCustomer = await handleAddNewCustomer(customerInput.trim(), phoneNumber, location);
        }
      }

      const saleData: Omit<Sale, 'id'> = {
        customer_id: checkoutCustomer?.id || null,
        total,
        date: new Date().toISOString(),
        payment_method: '',
        status: 'completed',
        notes: '',
        items: [],
      };

      const saleItems: Omit<SaleItem, 'id'>[] = cart.map(item => ({
        sale_id: 0,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        discount: 0,
        subtotal: item.product.price * item.quantity
      }));

      const newSale = await addSale({ ...saleData, items: saleItems });

      // Update product stock
      for (const item of cart) {
        const updatedStock = item.product.stock - item.quantity;
        await updateProduct(item.product.id, { ...item.product, stock: updatedStock });
      }

      setCart([]);
      setSelectedCustomer(null);
      setError(null);
      setCustomerInput('');
      setPhoneNumber('');
      setLocation('');
      setIsAddingNewCustomer(false);
    } catch (err) {
      setError(handleApiError(err));
    }
  };

  const handleAddNewCustomer = async (name: string, phone: string, location: string) => {
    try {
      const newCustomer = await addCustomer({
        name,
        phone,
        address: location,
        email: '',
        loyalty_points: 0
      });
      return newCustomer;
    } catch (err) {
      setError(handleApiError(err));
      return null;
    }
  };

  if (productsLoading || customersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('pos.title')}</h1>
      
      <ErrorMessage error={error || productsError || customersError || saleError} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="card-header">
            <CardTitle className="title-3d flex items-center">
              <ShoppingCart className="mr-2" size={24} />
              {t('Product')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
            <div className="flex items-center mb-4">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('pos.searchPlaceholder')}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className="p-4 border rounded-lg hover:bg-gray-100 transition-colors flex flex-col items-center"
                >
                  <img
                    src={product.image_url || '/placeholder-image.png'}
                    alt={product.name}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                  <p className="font-semibold text-center">{product.name}</p>
                  <p className="text-sm text-gray-600">${product.price.toFixed(2)}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="card-header">
            <CardTitle className="title-3d flex items-center">
              <User className="mr-2" size={24} />
              {t('pos.cart')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={customerInput}
                  onChange={(e) => {
                    setCustomerInput(e.target.value);
                    setIsAddingNewCustomer(true);
                  }}
                  onFocus={() => setIsAddingNewCustomer(true)}
                  placeholder={t('pos.selectOrAddCustomer')}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {isAddingNewCustomer && customerInput && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto">
                    {customers
                      .filter(c => c.name.toLowerCase().includes(customerInput.toLowerCase()))
                      .map(customer => (
                        <li
                          key={customer.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setSelectedCustomer(customer);
                            setCustomerInput(customer.name);
                            setPhoneNumber(customer.phone || '');
                            setLocation(customer.address || '');
                            setIsAddingNewCustomer(false);
                          }}
                        >
                          {customer.name}
                        </li>
                      ))}
                    <li
                      className="p-2 hover:bg-gray-100 cursor-pointer font-bold"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setIsAddingNewCustomer(true);
                      }}
                    >
                      {t('pos.addNewCustomer')}: {customerInput}
                    </li>
                  </ul>
                )}
              </div>
              {isAddingNewCustomer && (
                <>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t('pos.phoneNumber')}
                    className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={t('pos.location')}
                    className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
            </div>
            {cart.map(item => (
              <div key={item.product.id} className="flex justify-between items-center mb-2">
                <span>{item.product.name}</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                    className="w-16 p-1 border rounded mr-2"
                  />
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    {t('pos.remove')}
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 text-xl font-bold">
              {t('pos.total')}: ${total.toFixed(2)}
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              disabled={cart.length === 0}
            >
              <DollarSign size={20} className="mr-2" />
              {t('pos.checkout')}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POS;
