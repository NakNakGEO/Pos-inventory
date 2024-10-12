import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [widgets, setWidgets] = useState<string[]>(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    return savedWidgets ? JSON.parse(savedWidgets) : [
      'summary', 'salesByCategory', 'topSellingProducts', 'recentSales', 'lowStockProducts'
    ];
  });

  const allWidgets = [
    { id: 'summary', name: 'Summary' },
    { id: 'salesByCategory', name: 'Sales by Category' },
    { id: 'topSellingProducts', name: 'Top Selling Products' },
    { id: 'recentSales', name: 'Recent Sales' },
    { id: 'lowStockProducts', name: 'Low Stock Products' },
  ];

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(prev => 
      prev.includes(widgetId)
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const handleSave = () => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard Settings</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Choose Dashboard Widgets</h2>
        <div className="space-y-2">
          {allWidgets.map(widget => (
            <label key={widget.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={widgets.includes(widget.id)}
                onChange={() => handleWidgetToggle(widget.id)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span>{widget.name}</span>
            </label>
          ))}
        </div>
        <button
          onClick={handleSave}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;