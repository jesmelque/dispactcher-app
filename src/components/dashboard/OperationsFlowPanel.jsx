import {
  Box,
  Stack,
  Typography,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function OperationsFlowPanel() {
  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderRadius: '20px',

        background: 'rgba(8,18,36,.85)',
        backdropFilter: 'blur(16px)',

        border: '1px solid rgba(56,189,248,.12)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',

        gap: 3,
      }}
    >
      {/* LEFT SIDE - SEARCH */}
      <Box
        sx={{
          flex: 1,
          maxWidth: 550,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search trip, rider, facility, vehicle..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#38BDF8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '14px',
              color: '#fff',

              background: 'rgba(255,255,255,.03)',

              '& fieldset': {
                borderColor: 'rgba(255,255,255,.06)',
              },

              '&:hover fieldset': {
                borderColor: '#38BDF8',
              },

              '&.Mui-focused fieldset': {
                borderColor: '#38BDF8',
              },
            },
          }}
        />
      </Box>

      {/* CENTER METRICS */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <Chip
          icon={<DirectionsCarIcon />}
          label="34 Vehicles Active"
          sx={{
            color: '#38BDF8',
            background: 'rgba(56,189,248,.12)',
            border: '1px solid rgba(56,189,248,.25)',
          }}
        />

        <Chip
          icon={<LocalHospitalIcon />}
          label="12 Facilities"
          sx={{
            color: '#22C55E',
            background: 'rgba(34,197,94,.12)',
            border: '1px solid rgba(34,197,94,.25)',
          }}
        />

        <Chip
          icon={<WarningAmberIcon />}
          label="6 Alerts"
          sx={{
            color: '#F59E0B',
            background: 'rgba(245,158,11,.12)',
            border: '1px solid rgba(245,158,11,.25)',
          }}
        />
      </Stack>

      {/* RIGHT SIDE */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Chip
          label="LIVE"
          sx={{
            color: '#22C55E',
            fontWeight: 700,

            background: 'rgba(34,197,94,.12)',

            border: '1px solid rgba(34,197,94,.25)',
          }}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AccessTimeIcon
            sx={{
              color: '#8CA3C7',
              fontSize: 18,
            }}
          />

          <Typography
            sx={{
              color: '#8CA3C7',
              fontSize: '.9rem',
            }}
          >
            2:24 PM
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}