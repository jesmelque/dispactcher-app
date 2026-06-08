import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#1FB6FF',
      light: '#5ED3FF',
      dark: '#0D8DCC',
    },

    secondary: {
      main: '#00E5FF',
    },

    success: {
      main: '#22C55E',
    },

    warning: {
      main: '#F59E0B',
    },

    error: {
      main: '#EF4444',
    },

    background: {
      default: '#07111F',
      paper: '#0F1B2D',
    },

    text: {
      primary: '#E6F0FF',
      secondary: '#8CA3C7',
    },

    divider: 'rgba(255,255,255,0.08)',
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: `'Inter', 'Roboto', sans-serif`,

    h4: {
      fontWeight: 700,
      color: '#EAF4FF',
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top right, #10233f 0%, #07111F 60%)',
          minHeight: '100vh',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: 'rgba(15,27,45,0.88)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(31,182,255,0.12)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          borderRadius: 18,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F1B2D',
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#091524',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,

          '&:hover': {
            backgroundColor: 'rgba(31, 182, 255, 0.08)',
          },
        },

        containedPrimary: {
          background:
            'linear-gradient(135deg, #1FB6FF 0%, #00E5FF 100%)',
          color: '#07111F',
          fontWeight: 700,
          boxShadow: '0 0 20px rgba(31,182,255,0.25)',

          '&:hover': {
            background:
              'linear-gradient(135deg, #5ED3FF 0%, #1FB6FF 100%)',
          },

          '&:active': {
            background:
              'linear-gradient(135deg, #0D8DCC 0%, #1FB6FF 100%)',
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,

          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
          },

          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 122, 0, 0.18)', // 🔥 ORANGE ACTIVE STATE

            borderLeft: '3px solid #FF7A00',

            '&:hover': {
              backgroundColor: 'rgba(255, 122, 0, 0.25)',
            },
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        },
        head: {
          color: '#8CA3C7',
          fontWeight: 700,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
  },
});

export default theme;