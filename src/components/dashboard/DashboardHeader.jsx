import { Box, Typography, IconButton, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function DashboardHeader() {
  return (
    <Box
      sx={{
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      {/* LEFT: BRAND + TITLE */}
      <Box>
        <Typography
          sx={{
            color: '#f18b06',
            fontSize: '1.85rem',
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          🚐 ACCESSIBLE TRANSPORT SERVICES
        </Typography>

        <Typography
          sx={{
            color: '#ffffff',
            fontSize: '1.0rem',
            fontWeight: 400,
            lineHeight: 1.2,
            mt: 0.5,
          }}
        >
          Dispatch Command Center
        </Typography>

        
      </Box>

      {/* RIGHT: USER AREA */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton sx={{ color: '#EAF4FF' }}>
          <AccountCircleIcon />
        </IconButton>

        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ color: '#EAF4FF', fontSize: '0.9rem', fontWeight: 600 }}>
            Admin User
          </Typography>

          <Typography sx={{ color: '#8CA3C7', fontSize: '0.75rem' }}>
            Dispatcher
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}