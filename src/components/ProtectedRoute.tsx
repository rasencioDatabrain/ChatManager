import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const session = localStorage.getItem('mockSession');

  return session ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
