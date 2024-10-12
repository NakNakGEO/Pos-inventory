import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, List, Users, ShoppingCart, FileText, Truck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar: React.FC = () => {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/products', icon: Package, label: t('products') },
    { path: '/categories', icon: List, label: t('categories') },
    { path: '/suppliers', icon: Users, label: t('suppliers') },
    { path: '/customers', icon: Users, label: t('customers') },
    { path: '/pos', icon: ShoppingCart, label: t('pos') },
    { path: '/purchase-orders', icon: Truck, label: t('purchaseOrders') },
    { path: '/reports', icon: FileText, label: t('reports'), adminOnly: true },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-screen">
      <div className="p-4">
        <h1 className="text-2xl font-bold">{t('inventoryMS')}</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          (item.adminOnly && !isAdmin()) ? null : (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 mt-2 transition-colors duration-200 ${
                isActive(item.path)
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5 mr-2" />
              {item.label}
            </Link>
          )
        ))}
      </nav>
      <div className="absolute bottom-0 w-64 p-4">
        <button
          onClick={logout}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;