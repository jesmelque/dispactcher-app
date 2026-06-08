import {
  Box,
  Typography,
  Stack,
  Chip,
  Divider,
} from '@mui/material';

const alerts = [
  {
    title: 'Late Pickup',
    detail: 'Trip T-104 delayed by 14 min',
    level: 'warning',
  },
  {
    title: 'Driver No Show',
    detail: 'Trip T-220 requires reassignment',
    level: 'error',
  },
  {
    title: 'Unassigned Trip',
    detail: 'Pickup at Phoenix Medical Center',
    level: 'info',
  },
  {
    title: 'Payment Pending',
    detail: 'Invoice INV-482 awaiting settlement',
    level: 'warning',
  },
  {
    title: 'Vehicle Alert',
    detail: 'Unit VH-18 maintenance overdue',
    level: 'error',
  },
];

const levelColor = {
  info: '#38BDF8',
  warning: '#F59E0B',
  error: '#EF4444',
};

export default function AlertsPanel() {
  return (
    <Box
      sx={{
        minHeight: 720,
        p: 2.5,

        borderRadius: '22px',

        background: 'rgba(8, 18, 36, 0.86)',

        backdropFilter: 'blur(18px)',

        border: '1px solid rgba(31,182,255,0.12)',

        boxShadow: `
          0 12px 40px rgba(0,0,0,.35)
        `,

        overflowY: 'auto',
      }}
    >
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box>
          <Typography
            sx={{
              color: '#EAF4FF',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '.04em',
            }}
          >
            Dispatch Monitor
          </Typography>

          <Typography
            sx={{
              color: '#8CA3C7',
              fontSize: '.75rem',
              mt: 0.4,
            }}
          >
            Live operational alerts & exceptions
          </Typography>
        </Box>

        <Chip
          label="LIVE"
          size="small"
          sx={{
            color: '#22C55E',
            background: 'rgba(34,197,94,.12)',
            border: '1px solid rgba(34,197,94,.25)',
            fontWeight: 700,
          }}
        />
      </Stack>

      <Divider
        sx={{
          borderColor: 'rgba(255,255,255,0.05)',
          mb: 2,
        }}
      />

      {/* ALERT FEED */}
      <Stack spacing={1.4}>
        {alerts.map((alert, index) => (
          <Box
            key={index}
            sx={{
              p: 1.6,
              borderRadius: '14px',

              background: 'rgba(255,255,255,0.02)',

              border: `1px solid ${levelColor[alert.level]}25`,

              transition: '0.2s ease',

              '&:hover': {
                background: 'rgba(255,255,255,0.04)',
              },
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={0.7}
            >
              <Typography
                sx={{
                  color: '#E6F0FF',
                  fontWeight: 600,
                  fontSize: '.88rem',
                }}
              >
                {alert.title}
              </Typography>

              <Chip
                label={alert.level}
                size="small"
                sx={{
                  color: levelColor[alert.level],
                  backgroundColor: `${levelColor[alert.level]}15`,
                  border: `1px solid ${levelColor[alert.level]}25`,
                  fontSize: '.68rem',
                  fontWeight: 700,
                }}
              />
            </Stack>

            <Typography
              sx={{
                color: '#8CA3C7',
                fontSize: '.78rem',
                lineHeight: 1.45,
              }}
            >
              {alert.detail}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}