import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const theme = useMemo(
    () =>
      createTheme({
        direction: 'rtl',
        palette: {
          mode,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
        },
        typography: {
          fontFamily: 'Tajawal, sans-serif',
          h1: {
            fontFamily: 'Tajawal, sans-serif',
          },
          h2: {
            fontFamily: 'Tajawal, sans-serif',
          },
          h3: {
            fontFamily: 'Tajawal, sans-serif',
          },
          h4: {
            fontFamily: 'Tajawal, sans-serif',
          },
          h5: {
            fontFamily: 'Tajawal, sans-serif',
          },
          h6: {
            fontFamily: 'Tajawal, sans-serif',
          },
          body1: {
            fontFamily: 'Tajawal, sans-serif',
          },
          body2: {
            fontFamily: 'Tajawal, sans-serif',
          },
          button: {
            fontFamily: 'Tajawal, sans-serif',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                fontFamily: 'Tajawal, sans-serif',
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                fontFamily: 'Tajawal, sans-serif',
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newMode);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 