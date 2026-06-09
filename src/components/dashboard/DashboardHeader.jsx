import {
  Box,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAuth } from '../../context/AuthContext';

export default function DashboardHeader() {
  const { user } = useAuth();

  const displayName =
    user?.full_name ||
    user?.name ||
    `${user?.first_name || ''} ${user?.last_name || ''}`.trim() ||
    user?.email ||
    'Unknown User';

  const role =
    user?.role ||
    user?.user_type ||
    'User';

  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

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
            fontSize: '1rem',
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
          gap: 1.5,
        }}
      >
        <Avatar
          sx={{
            bgcolor: '#f18b06',
            width: 40,
            height: 40,
            fontWeight: 700,
          }}
        >
          {initials}
        </Avatar>

        <Box sx={{ textAlign: 'right' }}>
          <Typography
            sx={{
              color: '#EAF4FF',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            {displayName}
          </Typography>

          <Typography
            sx={{
              color: '#8CA3C7',
              fontSize: '0.75rem',
            }}
          >
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}