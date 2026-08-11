import { createBrowserRouter, Navigate } from 'react-router';
import { Landing } from './components/pages/Landing';
import { Login } from './components/pages/Login';
import { Register } from './components/pages/Register';
import { Layout } from './components/Layout';
import { Home } from './components/pages/Home';
import { Issues } from './components/pages/Issues';
import { IssueDetail } from './components/pages/IssueDetail';
import { ReportIssue } from './components/pages/ReportIssue';
import { MyIssues } from './components/pages/MyIssues';
import { Campaigns } from './components/pages/Campaigns';
import { CampaignDetail } from './components/pages/CampaignDetail';
import { AdminOverview } from './components/pages/AdminOverview';
import { Notifications } from './components/pages/Notifications';
import { Profile } from './components/pages/Profile';
import { VerificationRequest } from './components/pages/VerificationRequest';
import { UserManagement } from './components/pages/UserManagement';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}

export const router = createBrowserRouter([
  { path: '/', Component: Landing },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <Register />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'home', Component: Home },
      { path: 'issues', Component: Issues },
      { path: 'issues/:id', Component: IssueDetail },
      { path: 'report-issue', Component: ReportIssue },
      { path: 'my-issues', Component: MyIssues },
      { path: 'verification', Component: VerificationRequest },
      { path: 'campaigns', Component: Campaigns },
      { path: 'campaigns/:id', Component: CampaignDetail },
      { path: 'admin/overview', Component: AdminOverview },
      { path: 'admin/users', Component: UserManagement },
      { path: 'notifications', Component: Notifications },
      { path: 'profile', Component: Profile },
    ],
  },
  { path: '*', element: <Navigate to="/home" replace /> },
]);

