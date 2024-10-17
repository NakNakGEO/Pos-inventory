import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, Package, Users, ShoppingCart, LogOut } from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'nav.dashboard' },
    { path: '/products', icon: Package, label: 'nav.products' },
    { path: '/customers', icon: Users, label: 'nav.customers' },
    { path: '/pos', icon: ShoppingCart, label: 'nav.pos' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 bg-indigo-900 text-white">
        <h1 className="text-xl font-bold">POS Inventory</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 ${
              isActive(item.path) ? 'bg-gray-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5 mr-2" />
            {t(item.label)}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center text-gray-600 hover:text-gray-800">
          <LogOut className="h-5 w-5 mr-2" />
          {t('nav.logout')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
