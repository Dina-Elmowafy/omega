import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';

import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Chatbot from './components/Chatbot';
import Preloader from './components/Preloader';
import { DataProvider, useData } from './contexts/DataContext';
import { AuthProvider } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const { loading } = useData();

  if (loading) {
    return <Preloader />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Chatbot />
      </Layout>
    </HashRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
