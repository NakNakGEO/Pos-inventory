import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useSuppliers } from '../hooks/useSuppliers';
import { useSales } from '../hooks/useSales';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Package, Users, ShoppingCart } from 'lucide-react';
import DashboardWidget from '../components/DashboardWidget';

const Dashboard: React.FC = () => {
  const { products } = useProducts();
  const { categories } = useCategories();
  const { suppliers } = useSuppliers();
  const { sales } = useSales();

  const [widgets] = useState<string[]>(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      'summary', 'salesByCategory', 'topSellingProducts', 'recentSales', 'lowStockProducts'
    ];
  });

  useEffect(() => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
  }, [widgets]);

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const lowStockProducts = products.filter(product => product.stock < 10);

  const recentSales = sales.slice(-5).reverse();
  const topSellingProducts = products
    .map(product => ({
      name: product.name,
      totalSold: sales
        .filter(sale => sale.saleItems.some((item: { productId: number }) => item.productId === product.id))
        .reduce((sum, sale) => sum + sale.total, 0)
    }))
    .sort((a, b) => b.totalSold - a.totalSold)
    .slice(0, 5);

  const salesByCategory = categories.map(category => ({
    name: category.name,
    value: sales
      .filter(sale => sale.saleItems.some((item: { productId: number }) => {
        const product = products.find(p => p.id === item.productId);
        return product && product.categoryId === category.id;
      }))
      .reduce((sum, sale) => sum + sale.total, 0)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const widgetComponents: Record<string, JSX.Element> = {
    summary: (
      <DashboardWidget title="Summary">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <DollarSign size={40} className="text-green-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Sales</h3>
              <p className="text-2xl font-bold text-green-600">${totalSales.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Package size={40} className="text-blue-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Products</h3>
              <p className="text-2xl font-bold text-blue-600">{products.length}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Users size={40} className="text-purple-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Total Suppliers</h3>
              <p className="text-2xl font-bold text-purple-600">{suppliers.length}</p>
            </div>
          </div>
          <div className="flex items-center">
            <ShoppingCart size={40} className="text-orange-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold">Low Stock Items</h3>
              <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>
      </DashboardWidget>
    ),
    salesByCategory: (
      <DashboardWidget title="Sales by Category">
        <PieChart width={400} height={300}>
          <Pie
            data={salesByCategory}
            cx={200}
            cy={150}
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {salesByCategory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </DashboardWidget>
    ),
    topSellingProducts: (
      <DashboardWidget title="Top Selling Products">
        <BarChart width={400} height={300} data={topSellingProducts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSold" fill="#8884d8" />
        </BarChart>
      </DashboardWidget>
    ),
    recentSales: (
      <DashboardWidget title="Recent Sales">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {recentSales.map((sale) => (
              <tr key={sale.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {new Date(sale.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6 text-left">
                  {sale.saleItems.map((item: { productId: number }) => products.find(p => p.id === item.productId)?.name).join(', ')}
                </td>
                <td className="py-3 px-6 text-right">${sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardWidget>
    ),
    lowStockProducts: (
      <DashboardWidget title="Low Stock Products">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product</th>
              <th className="py-3 px-6 text-right">Current Stock</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {lowStockProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left">{product.name}</td>
                <td className="py-3 px-6 text-right">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DashboardWidget>
    ),
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {widgets.map((widget) => (
          <React.Fragment key={widget}>
            {widgetComponents[widget]}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;