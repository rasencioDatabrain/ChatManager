import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ConversationsPage from './pages/ConversationsPage';
import UserGroupsPage from './pages/UserGroupsPage';
import AutomaticGroupsPage from './pages/AutomaticGroupsPage';
import ReportsPage from './pages/ReportsPage';
import ScheduleConfigurationPage from './pages/ScheduleConfigurationPage';
import MessageTemplatesPage from './pages/MessageTemplatesPage';
import UserManagementPage from './pages/UserManagementPage';
import ConversationHistoryPage from './pages/ConversationHistoryPage';
import ClientProfilePage from './pages/ClientProfilePage';
import BulkMessagePage from './pages/BulkMessagePage';
import DashboardHomePage from './pages/DashboardHomePage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PlaceholderPage from './pages/PlaceholderPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="conversations" element={<ConversationsPage />} />
            <Route path="user-groups" element={<UserGroupsPage />} />
            <Route path="automatic-groups" element={<AutomaticGroupsPage />} />
            <Route path="bulk-message" element={<BulkMessagePage />} />
            <Route path="client-profile" element={<ClientProfilePage />} />
            <Route path="history" element={<ConversationHistoryPage />} />
            <Route path="user-management" element={<UserManagementPage />} />
            <Route path="message-templates" element={<MessageTemplatesPage />} />
            <Route path="schedule-configuration" element={<ScheduleConfigurationPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="tags" element={<PlaceholderPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;