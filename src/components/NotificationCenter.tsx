import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import { X } from 'lucide-react';

const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`mb-2 p-4 rounded-md shadow-md flex justify-between items-center ${
            notification.type === 'info'
              ? 'bg-blue-100 text-blue-800'
              : notification.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;