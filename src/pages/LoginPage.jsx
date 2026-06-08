import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/nemt-login.jpeg';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',

        background: `
  linear-gradient(
    rgba(18, 15, 45, .82),
    rgba(7, 17, 31, .88)
  ),
  url(${loginBg})
`,

        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 500,
          maxWidth: '100%',

          p: 5,

          borderRadius: '28px',

          background: 'rgba(255,255,255,.08)',

          backdropFilter: 'blur(20px)',

          border: '1px solid rgba(255,255,255,.12)',

          boxShadow:
            '0 25px 60px rgba(0,0,0,.35)',
        }}
      >
        {/* COMPANY */}
        <Typography
          sx={{
            color: '#F8A201',
            fontWeight: 800,
            fontSize: '2rem',
            textAlign: 'center',
            letterSpacing: 1,
          }}
        >
          ATS
        </Typography>

        <Typography
          sx={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: 700,
            fontSize: '1.4rem',
            mt: 1,
          }}
        >
          Accessible Transportation Services
        </Typography>

        <Typography
          sx={{
            color: '#B8C5D6',
            textAlign: 'center',
            mt: 1,
            mb: 4,
            fontSize: '.95rem',
          }}
        >
          NEMT Dispatch, Scheduling, Billing & Fleet Operations
        </Typography>

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,.08)',
            mb: 4,
          }}
        />

        {/* LOGIN FORM */}
        <TextField
          fullWidth
          label="Email Address"
          variant="outlined"
          margin="normal"
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
        />

        <Typography
          sx={{
            color: '#FFFFFF',
            mt: 3,
            mb: 1,
            fontWeight: 600,
          }}
        >
          Login Role
        </Typography>

        <RadioGroup defaultValue="dispatch">
          <FormControlLabel
            value="dispatch"
            control={<Radio />}
            label="Dispatch Operations"
          />

          <FormControlLabel
            value="finance"
            control={<Radio />}
            label="Finance & Billing"
          />

          <FormControlLabel
            value="admin"
            control={<Radio />}
            label="System Administrator"
          />
        </RadioGroup>

        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            mt: 4,
            height: 56,

            borderRadius: 3,

            fontWeight: 700,
            fontSize: '1rem',

            background:
              'linear-gradient(90deg,#6D5DF6,#8B5CF6)',

            '&:hover': {
              background:
                'linear-gradient(90deg,#5B4BE6,#7C4DFF)',
            },
          }}
        >
          Sign In
        </Button>

        {/* PLATFORM FEATURES */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,.08)',
          }}
        >
          <Typography
            sx={{
              color: '#B8C5D6',
              fontSize: '.85rem',
              mb: 1,
            }}
          >
            ✓ Trip Scheduling
          </Typography>

          <Typography
            sx={{
              color: '#B8C5D6',
              fontSize: '.85rem',
              mb: 1,
            }}
          >
            ✓ Dispatch Management
          </Typography>

          <Typography
            sx={{
              color: '#B8C5D6',
              fontSize: '.85rem',
              mb: 1,
            }}
          >
            ✓ Live Driver Tracking
          </Typography>

          <Typography
            sx={{
              color: '#B8C5D6',
              fontSize: '.85rem',
              mb: 1,
            }}
          >
            ✓ Billing & Claims Processing
          </Typography>

          <Typography
            sx={{
              color: '#B8C5D6',
              fontSize: '.85rem',
            }}
          >
            ✓ Fleet Operations & Reporting
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}