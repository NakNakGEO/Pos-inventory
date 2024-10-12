import { useState, useEffect } from 'react';
import { useProducts } from './useProducts';
import { useSales } from './useSales';

export const useInventoryForecast = () => {
  const { products } = useProducts();
  const { sales } = useSales();
  const [forecasts, setForecasts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const calculateForecast = () => {
      const newForecasts: { [key: number]: number } = {};

      products.forEach(product => {
        const productSales = sales.filter(sale => sale.productId === product.id);
        const totalSold = productSales.reduce((sum, sale) => sum + sale.quantity, 0);
        const averageSalesPerDay = totalSold / 30; // Assuming 30 days of sales data
        const daysUntilStockout = product.stock / averageSalesPerDay;
        
        newForecasts[product.id] = Math.round(daysUntilStockout);
      });

      setForecasts(newForecasts);
    };

    calculateForecast();
  }, [products, sales]);

  return forecasts;
};