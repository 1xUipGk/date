import { useState, useEffect } from 'react';
import { fetchMatches } from '../services/api';
import MatchCard from '../components/MatchCard';
import { Container, Box, Typography, CircularProgress, Button, useTheme } from '@mui/material';

function Home({ showLiveOnly }) {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const data = await fetchMatches(today);
        setMatches(data);
      } catch (err) {
        setError('حدث خطأ في تحميل المباريات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  // دالة لفلترة المباريات المباشرة
  const filterMatches = (matches) => {
    if (!showLiveOnly) return matches;
    
    const filteredMatches = {};
    Object.entries(matches).forEach(([league, leagueMatches]) => {
      const liveMatches = leagueMatches.filter(match => 
        match.status === 'جارية الآن' || 
        match.status.includes('الشوط') || 
        match.status === 'مباشر'
      );
      if (liveMatches.length > 0) {
        filteredMatches[league] = liveMatches;
      }
    });
    return filteredMatches;
  };

  return (
    <Container>
      <Typography variant="h5" component="h1" fontWeight="bold" sx={{ mb: 3, mt: 2 }}>
        المباريات
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : matches && Object.keys(matches).length > 0 ? (
        Object.entries(filterMatches(matches)).map(([league, leagueMatches]) => (
          <Box key={league} mb={4}>
            <Typography 
              variant="h6" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: '1rem',
                mb: 2
              }}
            >
              {league}
            </Typography>
            {leagueMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                league={league}
              />
            ))}
          </Box>
        ))
      ) : (
        <Typography align="center" color="text.secondary">
          لا توجد مباريات متاحة حالياً
        </Typography>
      )}
    </Container>
  );
}

export default Home;