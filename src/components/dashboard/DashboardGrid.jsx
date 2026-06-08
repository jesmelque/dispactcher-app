import { Box } from '@mui/material';

import OperationsFlowPanel from './OperationsFlowPanel';
import AlertsPanel from './AlertsPanel';
import KpiStrip from './KpiStrip';
import TripsTable from './TripsTable';

export default function DashboardGrid() {
  return (
    <Box sx={{ px: 3, py: 3 }}>
      {/* TOP BAR */}
      <OperationsFlowPanel />

      {/* MAIN CONTENT */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 340px',
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* LEFT COLUMN */}
        <Box>
          <KpiStrip />

          <Box sx={{ mt: 3 }}>
            <TripsTable />
          </Box>
        </Box>

        {/* RIGHT COLUMN */}
        <AlertsPanel />
      </Box>
    </Box>
  );
}