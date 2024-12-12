import { Box, Card, CardContent, Typography, Avatar, Chip, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import StadiumIcon from '@mui/icons-material/Stadium';
import TvIcon from '@mui/icons-material/Tv';

function MatchCard({ match, league }) {
  const theme = useTheme();

  // تحديد حالة المباراة بشكل دقيق
  const matchStatus = {
    isLive: match.status === 'جارية الآن' || match.status.includes('الشوط') || match.status === 'مباشر',
    isFinished: match.status === 'انتهت',
    isPostponed: match.status === 'تأجلت' || match.status === 'مؤجلة',
    isUpcoming: match.status === 'لم تبدأ',
    showScore: match.status === 'جارية الآن' || match.status.includes('الشوط') || match.status === 'مباشر' || match.status === 'انتهت'
  };

  // تحديد تنسيق حالة المباراة
  const getStatusStyles = () => {
    if (matchStatus.isLive) {
      return {
        color: '#ffffff',
        backgroundColor: '#2e7d32',
        '& .MuiChip-label': {
          color: '#ffffff'
        }
      };
    }
    if (matchStatus.isFinished) {
      return {
        color: '#ffffff',
        backgroundColor: '#d32f2f',
        '& .MuiChip-label': {
          color: '#ffffff'
        }
      };
    }
    if (matchStatus.isPostponed) {
      return {
        color: 'rgba(255, 255, 255, 0.75)',
        backgroundColor: 'rgba(97, 97, 97, 0.25)',
        '& .MuiChip-label': {
          color: 'rgba(255, 255, 255, 0.75)'
        }
      };
    }
    if (matchStatus.isUpcoming) {
      return {
        color: '#000000',
        backgroundColor: '#ffd54f',
        '& .MuiChip-label': {
          color: '#000000'
        }
      };
    }
    return {
      color: theme.palette.text.secondary,
      '& .MuiChip-label': {
        color: 'inherit'
      }
    };
  };

  return (
    <Box 
      component={match.id ? Link : 'div'}
      to={match.id ? `/match/${match.id}` : undefined}
      sx={{ 
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        mb: 2,
      }}
    >
      <Card 
        sx={{ 
          bgcolor: 'background.paper',
          borderRadius: (match.venue || match.channel) ? '12px 12px 0 0' : '12px',
          overflow: 'hidden'
        }}
      >
        <CardContent>
          {/* الجزء العلوي: اسم الدوري والوقت */}
          <Box 
            display="flex" 
            justifyContent="space-between" 
            alignItems="center"
            mb={2}
          >
            <Box 
              sx={{ 
                bgcolor: 'action.hover',
                borderRadius: 4,
                px: 1.5,
                py: 0.5,
                display: 'inline-block',
                boxShadow: 'none',
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                fontWeight="medium"
              >
                {league}
              </Typography>
            </Box>

            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                bgcolor: 'action.hover',
                borderRadius: 4,
                px: 1.5,
                py: 0.5,
              }}
            >
              {match.time}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            {/* الفريق المضيف */}
            <Box 
              flex={1} 
              display="flex" 
              flexDirection="column" 
              alignItems="center"
            >
              <Avatar 
                src={match.homeTeam.logo} 
                alt={match.homeTeam.name}
                sx={{ 
                  width: 56,
                  height: 56,
                  mb: 1,
                  borderRadius: '0',
                  background: 'none',
                  boxShadow: 'none',
                }} 
              />
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                align="center"
                sx={{ maxWidth: 120 }}
              >
                {match.homeTeam.name}
              </Typography>
            </Box>

            {/* النتيجة والحالة */}
            <Box 
              sx={{ 
                mx: 2, 
                minWidth: 120,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              {matchStatus.showScore && (
                <Box sx={{ position: 'relative' }}>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    fontWeight="bold"
                    color={matchStatus.isLive ? '#2e7d32' : 'text.primary'}
                    sx={{ 
                      mb: 1,
                      lineHeight: '1',
                    }}
                  >
                    {match.homeTeam.score} - {match.awayTeam.score}
                  </Typography>
                  {matchStatus.isLive && <span className="live-indicator" />}
                </Box>
              )}
              
              <Chip
                size="small"
                label={match.status}
                sx={{ 
                  mt: 2,
                  ...getStatusStyles()
                }}
              />
            </Box>

            {/* الفريق الضيف */}
            <Box 
              flex={1} 
              display="flex" 
              flexDirection="column" 
              alignItems="center"
            >
              <Avatar 
                src={match.awayTeam.logo} 
                alt={match.awayTeam.name}
                sx={{ 
                  width: 56,
                  height: 56,
                  mb: 1,
                  borderRadius: '0',
                  background: 'none',
                }} 
              />
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                align="center"
                sx={{ maxWidth: 120 }}
              >
                {match.awayTeam.name}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* معلومات إضافية خارج البطاقة */}
      {(match.venue || match.channel) && (
        <Box 
          sx={{ 
            display: 'flex',
            gap: 2,
            justifyContent: 'center',
            bgcolor: 'action.hover',
            borderRadius: '0 0 12px 12px',
            py: 0.75,
            px: 2,
            mt: '-1px',
            borderTop: 'none',
            boxShadow: 'none',
          }}
        >
          {match.venue && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <StadiumIcon color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                {match.venue}
              </Typography>
            </Box>
          )}
          {match.channel && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <TvIcon color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                {match.channel}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}

export default MatchCard; 