import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, Users, ShoppingCart, Truck, BarChart2, Settings, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/categories', icon: Users, label: 'Categories' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/pos', icon: ShoppingCart, label: 'POS' },
    { path: '/purchase-orders', icon: Truck, label: 'Purchase Orders' },
    { path: '/reports', icon: BarChart2, label: 'Reports' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    { path: '/suppliers', icon: Users, label: 'Suppliers' },
    { path: '/users', icon: Users, label: 'Users' },
  ];

  return (
    <aside
      className="w-64 h-screen flex flex-col text-indigo-200"
      style={{
        backgroundImage: 'url(https://www.codewithrandom.com/wp-content/uploads/2022/11/15-Bootstrap-login-forms38.png)', // Replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="p-4 bg-opacity-50 text-white shadow-lg">
        <h1 className="text-xl font-bold tracking-wide transform transition-transform duration-300 hover:scale-105">
          Maestro Furniture
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-base transition-all duration-300 rounded-lg ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-md'
                : 'text-indigo-200 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:shadow-md'
            }`}
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-indigo-800">
        <button className="flex items-center text-base text-indigo-200 hover:text-white transition-transform duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
          <LogOut className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
