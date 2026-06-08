import * as React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Toolbar,
  Typography,
  Divider,
  Box,
  IconButton,
  Collapse,
  Tooltip,
  useMediaQuery,
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import MapIcon from '@mui/icons-material/Map';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 270;
const collapsedWidth = 72;

export default function AppDrawer({ selected, onSelect }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const [openMenus, setOpenMenus] = React.useState({
    operations: true,
    drivers: false,
    billing: false,
    clients: false,
    fleet: false,
    reports: false,
    settings: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const width = drawerOpen ? drawerWidth : collapsedWidth;

  const menuSection = (label, icon, key, items) => (
    <>
      <ListItemButton
        onClick={() => toggleMenu(key)}
        sx={{
          borderRadius: 2,
          mx: 1,
          mb: 0.5,
          justifyContent: drawerOpen ? 'initial' : 'center',
          px: drawerOpen ? 2 : 1,
        }}
      >
        <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: drawerOpen ? 2 : 0 }}>
          {icon}
        </ListItemIcon>

        {drawerOpen && (
          <>
            <ListItemText primary={label} />
            {openMenus[key] ? <ExpandLess /> : <ExpandMore />}
          </>
        )}
      </ListItemButton>

      {drawerOpen && (
        <Collapse in={openMenus[key]} timeout="auto" unmountOnExit>
          <List disablePadding>
            {items.map((item) => (
              <ListItemButton
                key={item.value}
                selected={selected === item.value}
                onClick={() => {
                  onSelect(item.value);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  pl: 7,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      )}
    </>
  );

  const drawerContent = (
    <Box sx={{ height: '100%', color: '#fff' }}>
      {/* HEADER */}
      <Toolbar sx={{ px: 1, display: 'flex', justifyContent: 'space-between' }}>
        
        {/* CLICKABLE BRAND */}
        <ListItemButton
          onClick={() => navigate('/dashboard')}
          sx={{
            borderRadius: 2,
            flex: 1,
            justifyContent: drawerOpen ? 'flex-start' : 'center',
          }}
        >
          <ListItemIcon sx={{ color: '#f8a201', minWidth: 0, mr: drawerOpen ? 2 : 0 }}>
            <LocalShippingRoundedIcon />
          </ListItemIcon>

          {drawerOpen && (
            <Typography variant="h6" fontWeight={700}>
              Dispatcher
            </Typography>
          )}
        </ListItemButton>

        {/* TOGGLE BUTTON */}
        <IconButton
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{
            color: '#fff',
          }}
        >
          {drawerOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* MENU */}
      <List sx={{ py: 2 }}>
        {menuSection('Operations', <MapIcon />, 'operations', [
          { label: 'Trips', value: 'trips' },
          { label: 'Dispatch Board', value: 'dispatch' },
          { label: 'Live Tracking', value: 'tracking' },
          { label: 'Scheduling', value: 'scheduling' },
        ])}

        {menuSection('Drivers', <PeopleAltIcon />, 'drivers', [
          { label: 'Driver Directory', value: 'drivers' },
          { label: 'Driver Performance', value: 'driver-performance' },
        ])}

        {menuSection('Billing', <PaymentsIcon />, 'billing', [
          { label: 'Invoices', value: 'invoices' },
          { label: 'Payments', value: 'payments' },
          { label: 'Claims', value: 'claims' },
          { label: 'Payouts', value: 'payouts' },
        ])}

        {menuSection('Fleet', <DirectionsBusIcon />, 'fleet', [
          { label: 'Vehicles', value: 'vehicles' },
          { label: 'Maintenance', value: 'maintenance' },
        ])}

        {menuSection('Reports', <AssessmentIcon />, 'reports', [
          { label: 'Analytics', value: 'analytics' },
          { label: 'Trip Reports', value: 'trip-reports' },
          { label: 'Revenue Reports', value: 'revenue-reports' },
        ])}

        {menuSection('Settings', <SettingsIcon />, 'settings', [
          { label: 'Users', value: 'users' },
          { label: 'Roles & Permissions', value: 'roles' },
          { label: 'Integrations', value: 'integrations' },
        ])}
      </List>
    </Box>
  );

  return (
    <>
      {/* DESKTOP DRAWER */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width,
              transition: 'width 0.25s ease',
              overflowX: 'hidden',
              bgcolor: '#1f3a5f',
              color: '#fff',
              borderRight: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* MOBILE DRAWER */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          variant="temporary"
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              bgcolor: '#1f3a5f',
              color: '#fff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
}