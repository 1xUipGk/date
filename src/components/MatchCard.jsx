import { Box, Card, CardContent, Typography, Avatar, Chip, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme as useMuiTheme } from '@mui/material/styles';

// إضافة الأيقونات المخصصة بأسماء مختلفة
const CustomStadiumIcon = ({ color }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 526.47 367.66" 
    width="16" 
    height="16" 
    fill={color}
  >
    <path d="M473.62 0H275.75v91.71c45.04 5.99 79.79 44.55 79.79 91.23s-34.75 85.24-79.79 91.23v93.49h197.87c29.19 0 52.85-23.66 52.85-52.85v-24.57h-59.11c-25.66 0-46.47-20.8-46.47-46.47V123.9c0-25.66 20.8-46.47 46.47-46.47h59.11V52.86c0-29.19-23.66-52.85-52.85-52.85ZM446.81 131.55V236.1c0 15.02 12.17 27.19 27.19 27.19h52.47V104.36H474c-15.02 0-27.19 12.17-27.19 27.19ZM52.85 0h197.87v91.71c-45.04 5.99-79.79 44.55-79.79 91.23s34.75 85.24 79.79 91.23v93.49H52.85C23.66 367.66 0 344 0 314.81v-24.57h59.11c25.66 0 46.47-20.8 46.47-46.47V123.9c0-25.66-20.8-46.47-46.47-46.47H0V52.86C0 23.66 23.66 0 52.85 0ZM79.66 131.55V236.1c0 15.02-12.17 27.19-27.19 27.19H0V104.36h52.47c15.02 0 27.19 12.17 27.19 27.19ZM275.74 119.15v129.36c30.7-5.54 54-32.38 54-64.68s-23.3-59.14-54-64.68ZM250.72 119.15v129.36c-30.7-5.54-54-32.38-54-64.68s23.3-59.14 54-64.68" />
  </svg>
);

const CustomTvIcon = ({ color }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 640 512" 
    width="14" 
    height="14" 
    fill={color}
  >
    <path d="M64 64l0 288 512 0 0-288L64 64zM0 64C0 28.7 28.7 0 64 0L576 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 416c-35.3 0-64-28.7-64-64L0 64zM128 448l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-384 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
  </svg>
);

function MatchCard({ match, league }) {
  const theme = useMuiTheme();

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
              <CustomStadiumIcon color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                {match.venue}
              </Typography>
            </Box>
          )}
          {match.channel && (
            <Box display="flex" alignItems="center" gap={0.5}>
              <CustomTvIcon color={theme.palette.text.secondary} />
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