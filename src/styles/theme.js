import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const getTheme = (mode) => createTheme({
  direction: 'rtl',
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: mode === 'dark' 
            ? '0 4px 6px rgba(0, 0, 0, 0.2)'
            : '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          backgroundColor: mode === 'dark' ? '#333' : '#f0f0f0',
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          boxShadow: mode === 'dark'
            ? '0 2px 4px rgba(0, 0, 0, 0.2)'
            : '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Tajawal, sans-serif',
  },
});
