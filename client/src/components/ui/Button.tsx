import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'icon';
  size?: 'default' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  size = 'default', 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
  const variantClasses = {
    default: 'bg-indigo-600 text-white hover:bg-indigo-700',
    ghost: 'text-gray-700 hover:bg-gray-100',
    icon: 'p-2',
  };
  const sizeClasses = {
    default: 'px-4 py-2',
    icon: 'p-2',
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
