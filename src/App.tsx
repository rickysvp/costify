import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Members from './pages/Members';
import ApiKeys from './pages/ApiKeys';
import UsagePage from './pages/UsagePage';
import Routing from './pages/Routing';
import Billing from './pages/Billing';
import Alerts from './pages/Alerts';
import Docs from './pages/Docs';
import Settings from './pages/Settings';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import ApiMarket from './pages/ApiMarket';
import ApiKeyDetail from './pages/ApiKeyDetail';
import UserDetail from './pages/UserDetail';
import BudgetManagement from './pages/BudgetManagement';
import Changelog from './pages/Changelog';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Demo from './pages/Demo';
import InviteHandler from './pages/InviteHandler';
import InviteRegister from './pages/InviteRegister';
import Onboarding from './pages/Onboarding';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>} />
          <Route path="/projects/:id" element={<ProtectedRoute><Layout><ProjectDetail /></Layout></ProtectedRoute>} />
          <Route path="/members" element={<ProtectedRoute requireAdmin><Layout><Members /></Layout></ProtectedRoute>} />
          <Route path="/api-keys" element={<ProtectedRoute requireAdmin><Layout><ApiKeys /></Layout></ProtectedRoute>} />
          <Route path="/usage" element={<ProtectedRoute><Layout><UsagePage /></Layout></ProtectedRoute>} />
          <Route path="/routing" element={<ProtectedRoute requireAdmin><Layout><Routing /></Layout></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute requireAdmin><Layout><Billing /></Layout></ProtectedRoute>} />
          <Route path="/alerts" element={<ProtectedRoute><Layout><Alerts /></Layout></ProtectedRoute>} />
          <Route path="/docs" element={<ProtectedRoute><Layout><Docs /></Layout></ProtectedRoute>} />
          <Route path="/onboarding" element={<ProtectedRoute><Layout><Onboarding /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Layout><Reports /></Layout></ProtectedRoute>} />
          <Route path="/reports/:id" element={<ProtectedRoute><Layout><ReportDetail /></Layout></ProtectedRoute>} />
          <Route path="/api-market" element={<ProtectedRoute><Layout><ApiMarket /></Layout></ProtectedRoute>} />
          <Route path="/api-keys/:id" element={<ProtectedRoute requireAdmin><Layout><ApiKeyDetail /></Layout></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute><Layout><UserDetail /></Layout></ProtectedRoute>} />
          <Route path="/budget" element={<ProtectedRoute requireAdmin><Layout><BudgetManagement /></Layout></ProtectedRoute>} />
          <Route path="/changelog" element={<ProtectedRoute><Layout><Changelog /></Layout></ProtectedRoute>} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/invite" element={<InviteHandler />} />
          <Route path="/invite/register" element={<InviteRegister />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </LanguageProvider>
  );
}

export default App;
