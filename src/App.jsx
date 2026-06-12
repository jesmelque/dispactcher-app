import { Box, IconButton } from '@mui/material';
import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

import AppDrawer from './components/Drawer';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TripsPage from './pages/TripsPage';
import DispatchBoardPage from './pages/DispatchBoardPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import SchedulingPage from './pages/SchedulingPage';

import DriversPage from './pages/DriversPage';
import DriverPerformancePage from './pages/DriverPerformancePage';

import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import ClaimsPage from './pages/ClaimsPage';
import PayoutsPage from './pages/PayoutsPage';

import RidersPage from './pages/RidersPage';
import FacilitiesPage from './pages/FacilitiesPage';

import VehiclesPage from './pages/VehiclesPage';
import MaintenancePage from './pages/MaintenancePage';

import AnalyticsPage from './pages/AnalyticsPage';
import TripReportsPage from './pages/TripReportsPage';
import RevenueReportsPage from './pages/RevenueReportsPage';

import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import IntegrationsPage from './pages/IntegrationsPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(true);

  const selected = location.pathname.replace('/', '') || 'dashboard';

  // LOGIN PAGE 
  if (location.pathname === '/') {
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    );
  }

  // DASHBOARD LAYOUT
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {drawerOpen && (
        <AppDrawer
          selected={selected}
          onSelect={(value) => navigate(`/${value}`)}
        />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'all .3s ease',
          position: 'relative',
        }}
      >
        

        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/trips" element={<TripsPage />} />
          <Route path="/dispatch" element={<DispatchBoardPage />} />
          <Route path="/tracking" element={<LiveTrackingPage />} />
          <Route path="/scheduling" element={<SchedulingPage />} />

          <Route path="/drivers" element={<DriversPage />} />
          <Route
            path="/driver-performance"
            element={<DriverPerformancePage />}
          />

          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/claims" element={<ClaimsPage />} />
          <Route path="/payouts" element={<PayoutsPage />} />

          <Route path="/riders" element={<RidersPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />

          <Route path="/vehicles" element={<VehiclesPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />

          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/trip-reports" element={<TripReportsPage />} />
          <Route
            path="/revenue-reports"
            element={<RevenueReportsPage />}
          />

          <Route path="/users" element={<UsersPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route
            path="/integrations"
            element={<IntegrationsPage />}
          />
        </Routes>
      </Box>
    </Box>
  );
}