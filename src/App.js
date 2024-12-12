import { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  CssBaseline,
  CircularProgress
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { fetchMatches } from './services/api';
import MatchCard from './components/MatchCard';

function App() {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { mode, toggleTheme } = useTheme();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchMatches(today);
        setMatches(data);
      } catch (err) {
        setError('حدث خطأ في تحميل المباريات');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" color="primary" fontWeight="bold">
              مباريات اليوم
            </Typography>
            <IconButton onClick={toggleTheme} color="primary">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" align="center">
              {error}
            </Typography>
          ) : (
            Object.entries(matches).map(([league, leagueMatches]) => (
              <Box key={league} mb={4}>
                <Typography variant="h6" color="text.primary" mb={2}>
                  {league}
                </Typography>
                {leagueMatches.map((match, index) => (
                  <MatchCard key={index} match={match} />
                ))}
              </Box>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}

function AppWrapper() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWrapper; 