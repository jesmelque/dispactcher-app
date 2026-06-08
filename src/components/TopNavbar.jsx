import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Badge,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 240;

export default function TopNavbar({ title = 'Trip Dispatcher' }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#ffffff',
        color: '#111827',
        borderBottom: '1px solid #e5e7eb',
        ml: isMobile ? 0 : `${drawerWidth}px`,
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        
        {/* LEFT: TITLE */}
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>

        {/* RIGHT: MENU ITEMS */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
          {/* SEARCH */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              bgcolor: '#f3f4f6',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              width: isMobile ? 120 : 260,
            }}
          >
            <SearchIcon sx={{ color: '#6b7280', mr: 1 }} />
            <InputBase
              placeholder="Search..."
              sx={{ fontSize: 14 }}
              fullWidth
            />
          </Box>

          {/* NOTIFICATIONS */}
          <IconButton>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* PROFILE */}
          <IconButton>
            <AccountCircleIcon />
          </IconButton>

        </Box>
      </Toolbar>
    </AppBar>
  );
}