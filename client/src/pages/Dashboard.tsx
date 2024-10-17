import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, ChevronDown, Search, DollarSign, ShoppingCart, Package } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/Avatar";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/Table";
import DataSyncComponent from '../components/fecthapi/DataSyncComponent';
import axios from 'axios';
import { useProducts } from '../hooks/useProducts'; // Import the hook

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts(); // Use the hook
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/top-selling-products');
        setTopSellingProducts(response.data);
      } catch (error) {
        console.error('Error fetching top selling products:', error);
      }
    };

    const fetchRecentOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/recent-orders');
        setRecentOrders(response.data);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      }
    };

    fetchTopSellingProducts();
    fetchRecentOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input className="pl-8" placeholder="Search" type="search" />
            </div>
            <Button size="icon" variant="ghost">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" className="gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage alt="User avatar" src="/placeholder-user.jpg" />
                <AvatarFallback>GK</AvatarFallback>
              </Avatar>
              <span>Gokul GK</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-6 py-8">
          <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "PROFIT", value: "₹2,54,890", change: "+14.6%", icon: DollarSign },
              { title: "PF DAILY", value: "2,656", change: "+7.56%", icon: ShoppingCart },
              { title: "PRODUCTS", value: products.length, change: "+1.21%", icon: Package },
              { title: "ORDER", value: recentOrders.length, change: "-2.87%", icon: Package },
            ].map((item, index) => (
              <Card key={index} className="transform transition-transform duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                <CardHeader
                  className={`flex flex-row items-center justify-between space-y-0 px-4 pb-2 text-white rounded-t-lg animate-gradient`}
                >
                  <CardTitle className="title-3d">{item.title}</CardTitle>
                  <item.icon className="icon-3d" />
                </CardHeader>
                <CardContent
                  className={`p-4 text-white rounded-b-lg ${
                    item.change.startsWith('-')
                      ? 'bg-gradient-to-l from-pink-500 to-purple-500'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                  }`}
                >
                  <div className="text-2xl font-bold text-3d">{item.value}</div>
                  <p className="text-lg">
                    <span
                      className={`${
                        item.change.startsWith('-') ? 'text-glow-red' : 'text-glow-green'
                      } text-3d`}
                    >
                      {item.change}
                    </span>{' '}
                    from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 mb-8 md:grid-cols-2">
            <Card className="shadow-lg card">
              <CardHeader className="card-header">
                <CardTitle className="title-3d">Sales & Purchase</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Monthly Overview</h3>
                  <select className="bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Last 30 days</option>
                    <option>Last 60 days</option>
                    <option>Last 90 days</option>
                  </select>
                </div>
                <div className="w-full h-64">
                  {/* Placeholder for chart component */}
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    Chart Component Goes Here
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sales</p>
                    <p className="text-xl font-bold">₹1,234,567</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Purchase</p>
                    <p className="text-xl font-bold">₹987,654</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg card">
              <CardHeader className="card-header">
                <CardTitle className="title-3d">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
                <div className="space-y-4">
                  {[
                    ...topSellingProducts.map(product => ({
                      name: product.name,
                      sales: product.salesCount,
                      revenue: `₹${product.revenue.toLocaleString('en-IN')}`
                    }))
                  ].map((product, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} units sold</p>
                      </div>
                      <p className="font-bold">{product.revenue}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-lg card">
            <CardHeader className="card-header">
              <CardTitle className="title-3d">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white text-gray-900 rounded-b-lg">
              <div className="space-y-4">
                {[
                  { id: '001', customer: 'John Doe', date: '2023-05-15', total: '₹5,400' },
                  { id: '002', customer: 'Jane Smith', date: '2023-05-14', total: '₹3,200' },
                  { id: '003', customer: 'Bob Johnson', date: '2023-05-13', total: '₹7,800' },
                  { id: '004', customer: 'Alice Brown', date: '2023-05-12', total: '₹2,600' },
                  { id: '005', customer: 'Charlie Davis', date: '2023-05-11', total: '₹4,100' },
                ].map((order, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{order.customer}</p>
                      <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{order.total}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <DataSyncComponent />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
