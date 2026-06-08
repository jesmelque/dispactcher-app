import { Box } from '@mui/material';

import KpiStrip from '../components/dashboard/KpiStrip';
import OperationsFlowPanel from '../components/dashboard/OperationsFlowPanel';
import AlertsPanel from '../components/dashboard/AlertsPanel';
import TripsTable from '../components/dashboard/TripsTable';
import DashboardGrid from '../components/dashboard/DashboardGrid';
import DashboardHeader from '../components/dashboard/DashboardHeader';


export default function DashboardPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: 3,
        py: 3,

        background: `
          radial-gradient(circle at top right, rgba(31,182,255,0.10), transparent 25%),
          linear-gradient(180deg, #07111F 0%, #091A2F 100%)
        `,
      }}
    >
    
       <DashboardHeader />
      {/* Top command bar */}
      <OperationsFlowPanel />

      {/* Main content */}
      <Box
        sx={{
          mt: 3,
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* CENTER */}
        <Box>
  <KpiStrip />

  <Box sx={{ mt: 3 }}>
    <TripsTable />
  </Box>
</Box>

        {/* RIGHT */}
        <AlertsPanel />
      </Box>
    </Box>
  );
}