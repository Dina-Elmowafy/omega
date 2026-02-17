import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'client';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole = 'admin' }) => {
  const { user, isAuthenticated } = useAuth();

  // إذا لم يكن المستخدم مسجل دخول، أعد التوجيه للـ Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // إذا كان يتطلب دور معين وليس لديه هذا الدور، أعد التوجيه للـ Home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
