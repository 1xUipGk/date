import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  IconButton, 
  CircularProgress,
  Avatar,
  Paper,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { fetchMatchStats } from '../services/api';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TvIcon from '@mui/icons-material/Tv';
import SportsIcon from '@mui/icons-material/Sports';
import StadiumIcon from '@mui/icons-material/Stadium';
import { styled } from '@mui/material/styles';
import MicIcon from '@mui/icons-material/Mic';

const StatItem = ({ type, item }) => {
  const theme = useTheme();
  
  const getTypeColor = () => {
    switch(type) {
      case 'هدف':
        return '#2e7d32';
      case 'مساعدة':
        return '#1976d2';
      case 'بطاقة صفراء':
        return '#ed6c02';
      case 'بطاقة حمراء':
        return '#d32f2f';
      default:
        return theme.palette.text.primary;
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        mb: 2,
        background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
        borderRadius: 2
      }}
    >
      <Typography 
        variant="subtitle2" 
        sx={{ 
          color: getTypeColor(),
          mb: 2,
          fontWeight: 'bold',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}
      >
        {type}
      </Typography>

      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {item.player}
          </Typography>
          {item.time && (
            <Typography 
              variant="caption" 
              sx={{ 
                bgcolor: 'action.hover',
                px: 1,
                py: 0.5,
                borderRadius: 1
              }}
            >
              {item.time}'
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

const TeamInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  position: 'relative',
  
  '& .team-logo': {
    width: 100,
    height: 100,
    transition: 'transform 0.3s ease',
    background: 'none',
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      width: 60,
      height: 60
    },
    '&:hover': {
      transform: 'scale(1.1)'
    },
    '& .MuiAvatar-img': {
      objectFit: 'contain'
    }
  },
  
  '& .team-name': {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    textAlign: 'center',
    marginBottom: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  },
  
  '& .coach': {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem'
    }
  },
  
  '& .goals-list': {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    width: '100%',
    
    '& li': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(1),
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(0.5),
      borderRadius: theme.shape.borderRadius,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      
      '& .player-name': {
        color: '#fff',
        fontWeight: 500
      },
      
      '& .goal-time': {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.85rem',
        padding: '2px 6px',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
      }
    }
  },
  
  '& .score': {
    display: 'none'
  }
}));

const InfoItem = ({ icon: Icon, text }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Icon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.7)' }} />
    <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
      {text}
    </Typography>
  </Box>
);

const MatchBackground = styled(Box)(({ theme, backgroundimage }) => ({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("${backgroundimage || '/images/black_flag.gif'}")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(0)',
    opacity: 0.3,
    borderRadius: theme.shape.borderRadius * 2,
    zIndex: 0,
    transition: 'all 0.3s ease'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
    borderRadius: theme.shape.borderRadius * 2,
    zIndex: 1
  },
  '&:hover::before': {
    transform: 'scale(1.05)',
    opacity: 0.4
  }
}));

const MatchInfo = ({ info }) => {
  const theme = useTheme();
  
  const getBgImage = (competition) => {
    '/images/black_flag.gif';
  };

  return (
    <MatchBackground
      component={Paper}
      backgroundimage={getBgImage(info?.competition)}
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        background: 'transparent',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '& > *': {
          position: 'relative',
          zIndex: 2
        }
      }}
    >
      {/* عنوان البطولة */}
      <Typography 
        variant="h6" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1.1rem',
          mb: 2
        }}
      >
        {info?.competition}
      </Typography>

      {/* معلومات الفريقين */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr', 
        gap: { xs: 1, sm: 3 },
        px: { xs: 1, sm: 2 }
      }}>
        {/* الفريق الأول */}
        <TeamInfo>
          <Avatar 
            src={info?.homeTeam?.logo} 
            variant="square"
            className="team-logo"
            sx={{
              background: 'none',
              '& img': {
                objectFit: 'contain'
              }
            }}
          />
          <Typography className="team-name">
            {info?.homeTeam?.name}
          </Typography>
          {info?.homeTeam?.coach && (
            <Typography className="coach">
              المدرب: {info.homeTeam.coach}
            </Typography>
          )}
          {info?.homeTeam?.goals?.length > 0 && (
            <ul className="goals-list">
              {info.homeTeam.goals.map((goal, index) => (
                <li key={`home-goal-${index}`}>
                  <span className="player-name">{goal.player}</span>
                  <span className="goal-time">{goal.time}'</span>
                </li>
              ))}
            </ul>
          )}
        </TeamInfo>

        {/* النتيجة والوقت في المنتصف */}
        <Box sx={{ textAlign: 'center' }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              justifyContent: 'center',
              mb: 1
            }}
          >
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
              {info?.homeTeam?.score}
            </Typography>
            <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>:</Typography>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold' }}>
              {info?.awayTeam?.score}
            </Typography>
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: info?.status === 'مباشر' ? '#2e7d32' : 'text.secondary',
              fontWeight: info?.status === 'مباشر' ? 'bold' : 'normal',
              mb: 0.5
            }}
          >
            {info?.status}
          </Typography>
          {info?.fullStatus && (
            <Typography variant="body2" color="text.secondary" fontWeight="medium">
              {info.fullStatus}
            </Typography>
          )}
          {info?.matchTime && (
            <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
              {info.matchTime}
            </Typography>
          )}
        </Box>

        {/* الفريق الثاني */}
        <TeamInfo>
          <Avatar 
            src={info?.awayTeam?.logo} 
            variant="square"
            className="team-logo"
          />
          <Typography className="team-name">
            {info?.awayTeam?.name}
          </Typography>
          {info?.awayTeam?.coach && (
            <Typography className="coach">
              المدرب: {info.awayTeam.coach}
            </Typography>
          )}
          {info?.awayTeam?.goals?.length > 0 && (
            <ul className="goals-list">
              {info.awayTeam.goals.map((goal, index) => (
                <li key={`away-goal-${index}`}>
                  <span className="player-name">{goal.player}</span>
                  <span className="goal-time">{goal.time}'</span>
                </li>
              ))}
            </ul>
          )}
        </TeamInfo>
      </Box>

      {/* معلومات إضافية */}
      <Box 
        sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          alignItems: 'center',
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}
      >
        {info?.venue && <InfoItem icon={StadiumIcon} text={info.venue} />}
        {info?.date && <InfoItem icon={CalendarTodayIcon} text={info.date} />}
        {info?.channel && <InfoItem icon={TvIcon} text={info.channel} />}
        {info?.commentator && (
          <InfoItem 
            icon={MicIcon} 
            text={`المعلق: ${info.commentator}`} 
          />
        )}
        {info?.referee && (
          <InfoItem 
            icon={SportsIcon} 
            text={`الحكم: ${info.referee}`} 
          />
        )}
      </Box>
    </MatchBackground>
  );
};

const Timeline = ({ events = [] }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 2, 
      mb: 2,
      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: 2
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      أحداث المباراة
    </Typography>
    {events.map((event, index) => (
      <Box 
        key={index} 
        sx={{
          display: 'flex',
          gap: 2,
          mb: 1,
          p: 1,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.hover'
          }
        }}
      >
        {event.time && (
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
            {event.time}
          </Typography>
        )}
        <Typography variant="body2" fontWeight={event.title ? 'bold' : 'normal'}>
          {event.title || event.description}
        </Typography>
      </Box>
    ))}
  </Paper>
);

const StandingsTable = ({ standings }) => (
  <Paper 
    elevation={0} 
    sx={{ 
      p: 2, 
      mb: 2,
      background: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
      borderRadius: 2,
      overflow: 'auto'
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="bold">
      ترتيب المجموعة
    </Typography>
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(224, 224, 224, 0.4)' }}>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>#</th>
            <th style={{ padding: '12px 8px', textAlign: 'right' }}>الفريق</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>لعب</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>له</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>عليه</th>
            <th style={{ padding: '12px 8px', textAlign: 'center' }}>نقاط</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => (
            <tr 
              key={index}
              style={{ 
                borderBottom: '1px solid rgba(224, 224, 224, 0.2)',
                backgroundColor: index % 2 === 0 ? 'rgba(0, 0, 0, 0.02)' : 'transparent'
              }}
            >
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {team.position}
              </td>
              <td style={{ padding: '12px 8px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar 
                    src={team.team.logo} 
                    variant="square" 
                    sx={{ width: 24, height: 24 }}
                  />
                  <Typography variant="body2">
                    {team.team.name}
                  </Typography>
                </Box>
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {team.played}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {team.goalsFor}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                {team.goalsAgainst}
              </td>
              <td style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 'bold' }}>
                {team.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </Paper>
);

function MatchStats() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchMatchStats(matchId);
        setStats(data);
      } catch (err) {
        setError('حدث خطأ في تحميل الإحصائيات');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [matchId]);

  return (
    <Box sx={{ py: 3 }}>
      <Box 
        display="flex" 
        alignItems="center" 
        mb={3}
        sx={{ px: 2 }}
      >
        <IconButton 
          onClick={() => navigate(-1)} 
          sx={{ 
            mr: 2,
            color: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          إحصائيات المباراة
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : stats ? (
        <Box>
          <MatchInfo info={stats.matchInfo} />
          {stats.standings?.length > 0 && <StandingsTable standings={stats.standings} />}
          {stats.timeline?.length > 0 && <Timeline events={stats.timeline} />}
          {stats.goals?.map((goal, index) => (
            <StatItem key={`goal-${index}`} type="هدف" item={goal} />
          ))}
          {stats.assists?.map((assist, index) => (
            <StatItem key={`assist-${index}`} type="مساعدة" item={assist} />
          ))}
          {stats.cards?.map((card, index) => (
            <StatItem key={`card-${index}`} type={card.type} item={card} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export default MatchStats; 