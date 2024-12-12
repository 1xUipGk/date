import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const TeamInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  padding: theme.spacing(1),
}));

const MatchCard = ({ match }) => {
  const {
    homeTeam,
    awayTeam,
    homeTeamLogo,
    awayTeamLogo,
    time,
    status,
    channel
  } = match;

  return (
    <StyledCard>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <TeamInfo>
            <Avatar
              src={homeTeamLogo}
              alt={homeTeam}
              sx={{ width: 56, height: 56, mb: 1 }}
            />
            <Typography variant="body2" align="center">
              {homeTeam}
            </Typography>
          </TeamInfo>

          <Box textAlign="center" px={2}>
            <Typography color="primary" fontWeight="bold">
              {status}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {time}
            </Typography>
            {channel && (
              <Typography variant="caption" color="text.secondary">
                {channel}
              </Typography>
            )}
          </Box>

          <TeamInfo>
            <Avatar
              src={awayTeamLogo}
              alt={awayTeam}
              sx={{ width: 56, height: 56, mb: 1 }}
            />
            <Typography variant="body2" align="center">
              {awayTeam}
            </Typography>
          </TeamInfo>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default MatchCard; 