import { Box, Typography, Chip } from '@mui/material';

const metrics = [
  {
    label: 'Reserved Trips',
    value: 42,
    trend: '+8',
    color: '#38BDF8',
  },
  {
    label: 'Active Trips',
    value: 27,
    trend: '+4',
    color: '#22C55E',
  },
  {
    label: 'In Progress',
    value: 18,
    trend: '+2',
    color: '#06B6D4',
  },
  {
    label: 'Completed',
    value: 186,
    trend: '+14',
    color: '#10B981',
  },
  {
    label: 'Unassigned',
    value: 6,
    trend: 'urgent',
    color: '#F59E0B',
  },
  {
    label: 'Cancelled',
    value: 3,
    trend: '-1',
    color: '#EF4444',
  },
  {
    label: 'No Shows',
    value: 2,
    trend: 'alert',
    color: '#FB7185',
  },
  {
    label: 'Revenue Collected',
    value: '$24.8K',
    trend: '+12%',
    color: '#22C55E',
  },
  {
    label: 'Outstanding',
    value: '$6.2K',
    trend: 'pending',
    color: '#EF4444',
  },
  {
    label: 'Vehicles Active',
    value: 34,
    trend: '82%',
    color: '#60A5FA',
  },
];

export default function KpiStrip() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(180px, 1fr))',
        gap: 2,
      }}
    >
      {metrics.map((item) => (
        <Box
          key={item.label}
          sx={{
            px: 2.5,
            py: 2,
            borderRadius: '18px',

            background: 'rgba(10, 25, 47, 0.78)',
            backdropFilter: 'blur(14px)',

            border: `1px solid ${item.color}25`,

            boxShadow: `
              inset 0 1px 0 rgba(255,255,255,0.03),
              0 0 0 1px rgba(255,255,255,0.02),
              0 10px 30px rgba(0,0,0,0.28)
            `,
          }}
        >
          <Typography
            sx={{
              color: '#EAF4FF',
              fontWeight: 700,
              fontSize: '1.65rem',
              lineHeight: 1.1,
            }}
          >
            {item.value}
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              color: '#8CA3C7',
              fontSize: '0.78rem',
              letterSpacing: '0.03em',
            }}
          >
            {item.label}
          </Typography>

          <Chip
            label={item.trend}
            size="small"
            sx={{
              mt: 1.25,
              height: 22,
              fontSize: '0.7rem',
              fontWeight: 700,

              color: item.color,

              backgroundColor: `${item.color}15`,
              border: `1px solid ${item.color}30`,
            }}
          />
        </Box>
      ))}
    </Box>
  );
}