
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ marginLeft: '280px', width: 'calc(100% - 280px)', height: '100vh', overflowY: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;
