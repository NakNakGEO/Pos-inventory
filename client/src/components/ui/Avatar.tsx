import React, { useState } from 'react';

interface AvatarProps {
  className?: string;
  children: React.ReactNode;
}

export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => {
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
    </div>
  );
};

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  onError?: () => void;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ onError, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (error) {
    return null;
  }

  return <img {...props} onError={handleError} className="h-full w-full object-cover rounded-full" />;
};

interface AvatarFallbackProps {
  children: React.ReactNode;
}

export const AvatarFallback: React.FC<AvatarFallbackProps> = ({ children }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-600 text-sm font-medium uppercase rounded-full">
      {children}
    </div>
  );
};
