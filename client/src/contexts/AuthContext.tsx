import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.post('/validate-token', { token });
          if (response.data.valid) {
            const user: User = {
              id: response.data.userId,
              username: response.data.username,
              role: response.data.role as 'admin' | 'user'
            };
            setUser(user);
          } else {
            // Token is invalid, remove it and log out the user
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
    };
    validateToken();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/login', { username, password });
      const token = response.data.token;
      const user = decodeToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAdmin = () => user?.role === 'admin';

  const decodeToken = (token: string): User => {
    const decoded = jwtDecode<any>(token);
    return {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role as 'admin' | 'user'
    };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
