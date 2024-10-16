import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { isLoggedIn } from './services/api';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import POS from './pages/POS';
import Products from './pages/Products';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/categories" 
          element={isLoggedIn() ? <Categories /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/pos" 
          element={isLoggedIn() ? <POS /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/products" 
          element={isLoggedIn() ? <Products /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/" 
          element={isLoggedIn() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
