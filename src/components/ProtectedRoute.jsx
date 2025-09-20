import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <div className="p-8 text-center text-red-600">Access denied.</div>;
  return children;
};

export default ProtectedRoute;
