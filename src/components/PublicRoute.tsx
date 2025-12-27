import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const session = localStorage.getItem('mockSession');

  return session ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
