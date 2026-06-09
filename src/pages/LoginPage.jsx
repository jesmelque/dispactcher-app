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
  Alert,
} from '@mui/material';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import loginBg from '../assets/nemt-login.jpeg';

import { login } from '../auth/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();

  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('dispatcher');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await login(
        email,
        password
      );

      /*
      Backend returns:
      {
        access,
        refresh,
        user
      }
      */

      loginUser(data);

      navigate('/dashboard');
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.non_field_errors?.[0] ||
          'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',

        background: `
          linear-gradient(
            rgba(18,15,45,.82),
            rgba(7,17,31,.88)
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
        <Typography
          sx={{
            color: '#F8A201',
            fontWeight: 800,
            fontSize: '2rem',
            textAlign: 'center',
          }}
        >
          ATS
        </Typography>

        <Typography
          sx={{
            color: '#fff',
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

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email Address"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Typography
          sx={{
            color: '#fff',
            mt: 3,
            mb: 1,
            fontWeight: 600,
          }}
        >
          Login Role
        </Typography>

        <RadioGroup
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >
          <FormControlLabel
            value="dispatcher"
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
          onClick={handleLogin}
          disabled={loading}
          sx={{
            mt: 4,
            height: 56,

            borderRadius: 3,

            fontWeight: 700,

            background:
              'linear-gradient(90deg,#6D5DF6,#8B5CF6)',
          }}
        >
          {loading
            ? 'Signing In...'
            : 'Sign In'}
        </Button>
      </Paper>
    </Box>
  );
}