import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import { isLoggedIn } from './services/api';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import POS from './pages/POS';
import Products from './pages/Products';
import Customers from './pages/Customers';
import PurchaseOrders from './pages/PurchaseOrders';
import PurchaseOrderReport from './components/PurchaseOrderReport';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              isLoggedIn() ? (
                <Layout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/pos" element={<POS />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/purchase-orders" element={<PurchaseOrders />} />
                    <Route path="/purchase-order-report" element={<PurchaseOrderReport />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
