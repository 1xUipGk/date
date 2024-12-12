import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Box,
  Typography,
  IconButton,
  CssBaseline,
  CircularProgress,
  ButtonGroup,
  Button,
  styled,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Menu,
  Switch,
  ListItemText,
  ListItemIcon,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  List
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from './contexts/ThemeContext.jsx';
import { fetchMatches } from './services/api.js';
import MatchCard from './components/MatchCard.jsx';
import moment from 'moment';
import 'moment/locale/ar';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaletteIcon from '@mui/icons-material/Palette';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MatchStats from './pages/MatchStats';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// إضافة الأيقونات المخصصة في بداية الملف
const StadiumIcon = ({ color }) => (
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

const TvIcon = ({ color }) => (
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

// تنسيق مخصص للأزرار
const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  '& .MuiButton-root': {
    minWidth: 100,
    margin: '0 0',
    borderRadius: 0,
    '&:not(:first-of-type):not(:last-of-type)': {
      borderRadius: 0,
    }
  },
  '& .MuiButton-root:first-of-type': {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: 'none',
  },
  '& .MuiButton-root:last-of-type': {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    borderRight: 'none',

  }
  
}));

// تنسيق مخصص للقائمة المنسدلة
const StyledSelect = styled(Select)(({ theme }) => ({
  '& .MuiSelect-select': {
    textAlign: 'right',
    paddingRight: '14px',
    paddingLeft: '32px',
    direction: 'rtl'
  },
  '& .MuiSelect-icon': {
    right: 'auto',
    left: '7px'
  }
}));

// تنسيق مخصص لعناصر القائمة
const StyledMenuItem = styled(MenuItem)({
  justifyContent: 'right',
  direction: 'rtl',
  width: '100%',
  textAlign: 'right'
});

function App() {
  const { mode, toggleTheme } = useTheme();
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Router>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <CssBaseline />
        <Container maxWidth="lg">
          <Routes>
            <Route 
              path="/" 
              element={
                <MatchesList 
                  showLiveOnly={showLiveOnly} 
                  setShowLiveOnly={setShowLiveOnly}
                />
              } 
            />
            <Route path="/match/:matchId" element={<MatchStats />} />
          </Routes>
        </Container>
      </Box>
    </Router>
  );
}

// نقل المحتوى الرئيسي إلى مكون جديد
function MatchesList({ showLiveOnly, setShowLiveOnly }) {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const { mode, toggleTheme } = useTheme();
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [timeFormat24, setTimeFormat24] = useState(() => {
    return localStorage.getItem('timeFormat24') !== 'false';
  });
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const dateInputRef = useRef(null);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLeagueFilter, setShowLeagueFilter] = useState(false);
  const [selectedLeagues, setSelectedLeagues] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentMonth, setCurrentMonth] = useState(moment());

  // دوال تغيير الشهر
  const handlePrevMonth = () => {
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => moment(prev).add(1, 'month'));
  };

  // قائمة الدوريات المتاحة
  const leagues = [
    {
      id: 'all',
      name: 'كل البطولات',
      logo: 'https://prod-media.beinsports.com/image/upload/all_leagues.png'
    },
    {
      id: 'europa-league',
      name: 'الدوري الأوروبي',
      logo: 'https://prod-media.beinsports.com/image/4oogyu6o156iphvdvphwpck10.png'
    },
    {
      id: 'egyptian-league',
      name: 'دوري المحترفين المصري',
      logo: 'https://prod-media.beinsports.com/image/2kwbbcootiqqgmrzs6o5inle5.png'
    },
    {
      id: 'egyptian-cup',
      name: 'كأس الرابطة المصرية',
      logo: 'https://prod-media.beinsports.com/image/34pl8szyvrbwcmfkuocjm3r6t.png'
    },
    {
      id: 'conference-league',
      name: 'دوري المؤتمر الأوروبي',
      logo: 'https://prod-media.beinsports.com/image/dm5ka0os1e3dxcp3vh05kmp33.png'
    },
    {
      id: 'iraqi-league',
      name: 'دوري نجوم العراق',
      logo: 'https://prod-media.beinsports.com/image/6by3h89i2eykc341oz7lv1ddd.png'
    },
    {
      id: 'jordan-cup',
      name: 'كأس الأردن',
      logo: 'https://prod-media.beinsports.com/image/1r097lpxe0xn03ihb7wi98kao.png'
    },
    {
      id: 'volleyball-cwc',
      name: 'كأس العالم لأندية | كرة طائرة',
      logo: 'https://prod-media.beinsports.com/image/1fedahp0rws09tj451onten8r.png'
    }
  ];

  // تصفية الدوريات حسب البحث
  const filteredLeagues = leagues.filter(league => 
    league.name.includes(searchQuery)
  );

  // دالة لترتيب المبا��يات داخل كل دوري
  const sortMatches = (matches) => {
    const sortedMatches = {};
    
    Object.entries(matches).forEach(([league, leagueMatches]) => {
      sortedMatches[league] = [...leagueMatches].sort((a, b) => {
        // المباريات المباشرة أولاً
        if (a.status === 'مباشر' && b.status !== 'مباشر') return -1;
        if (b.status === 'مباشر' && a.status !== 'مباشر') return 1;
        
        // ثم المباريات الجارية
        const aIsLive = a.status === 'جارية الآن' || a.status.includes('الشوط');
        const bIsLive = b.status === 'جارية الآن' || b.status.includes('الشوط');
        if (aIsLive && !bIsLive) return -1;
        if (bIsLive && !aIsLive) return 1;
        
        // المباريات التي لم تبدأ بعد حسب القت
        if (a.status === 'لم تبدأ' && b.status === 'لم تبدأ') {
          return a.time.localeCompare(b.time);
        }
        
        // المباريات المنتهية ي النهاية
        if (a.status === 'انتهت' && b.status !== 'انتهت') return 1;
        if (b.status === 'انتهت' && a.status !== 'انتهت') return -1;
        
        return 0;
      });
    });
    
    return sortedMatches;
  };

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const data = await fetchMatches(selectedDate);
        setMatches(sortMatches(data)); // ترتيب المباريات بعد جلبها
      } catch (err) {
        setError('حدث خطأ في تحميل المباريات');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();

    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  // تحديث الرابط عند تغيير التاريخ
  useEffect(() => {
    const url = new URL(window.location);
    url.searchParams.set('date', selectedDate);
    window.history.pushState({}, '', url);
  }, [selectedDate]);

  const today = moment();

  const handleDateChange = (date) => {
    setSelectedDate(moment(date).format('YYYY-MM-DD'));
  };

  // تحديث العنوان حسب التاريخ المحدد
  const getTitle = () => {
    const date = moment(selectedDate);
    
    if (date.isSame(today, 'day')) return 'مباريات اليوم';
    if (date.isSame(today.clone().add(1, 'day'), 'day')) return 'مباريات الغد';
    if (date.isSame(today.clone().subtract(1, 'day'), 'day')) return 'مباريات الأمس';
    return `مباريات ${date.format('DD/MM/YYYY')}`;
  };

  // دالة لفلترة المباريات المباشرة
  const filterMatches = (matches) => {
    if (!showLiveOnly) return matches;

    const filteredMatches = {};
    Object.entries(matches).forEach(([league, leagueMatches]) => {
      const liveMatches = leagueMatches.filter(match => 
        match.status === 'مباشر' || 
        match.status === 'جارية الآن' || 
        match.status.includes('الشوط')
      );
      
      if (liveMatches.length > 0) {
        filteredMatches[league] = liveMatches;
      }
    });
    return filteredMatches;
  };

  // تحديث عرض المباريات حسب الدوري المحدد
  const displayedMatches = useMemo(() => {
    const filtered = filterMatches(matches);
    if (selectedLeague === 'all') return filtered;
    
    const league = leagues.find(l => l.id === selectedLeague);
    if (!league) return {};
    
    return {
      [league.name]: filtered[league.name] || []
    };
  }, [matches, selectedLeague, showLiveOnly]);

  // حفظ الإعدادات
  useEffect(() => {
    localStorage.setItem('timeFormat24', timeFormat24);
  }, [timeFormat24]);

  // تحويل الوقت من 24 إلى 12 ساعة
  const formatTime = (time) => {
    if (timeFormat24) return time;
    
    const [hours, minutes] = time.split(':');
    let h = parseInt(hours);
    const period = h >= 12 ? 'م' : 'ص';
    
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    
    return `${h}:${minutes} ${period}`;
  };

  // تحديث دالة فتح التقويم
  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  // تحديث قائمة الإعدادات
  const SettingsContent = () => (
    <Box sx={{ width: '100%' }}>
      <Box display="flex" alignItems="center" mb={3}>
        <ListItemIcon>
          <PaletteIcon />
        </ListItemIcon>
        <ListItemText 
          primary="السمة"
          secondary={
            <Box 
              component="span" 
              display="flex" 
              gap={1} 
              mt={1}
              sx={{ 
                '& .MuiButton-root': {
                  flex: 1
                }
              }}
            >
              <Button
                size="small"
                variant={mode === 'light' ? 'contained' : 'outlined'}
                onClick={() => toggleTheme('light')}
                fullWidth
              >
                فاتح
              </Button>
              <Button
                size="small"
                variant={mode === 'dark' ? 'contained' : 'outlined'}
                onClick={() => toggleTheme('dark')}
                fullWidth
              >
                داكن
              </Button>
            </Box>
          }
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box display="flex" alignItems="center">
        <ListItemIcon>
          <AccessTimeIcon />
        </ListItemIcon>
        <ListItemText 
          primary="نظام 24 ساعة"
          secondary={timeFormat24 ? "تنسيق 24 ساعة" : "تنسيق 12 ساعة"}
        />
        <Switch
          edge="end"
          checked={timeFormat24}
          onChange={(e) => setTimeFormat24(e.target.checked)}
        />
      </Box>
    </Box>
  );

  // دالة لإنشاء مصفوفة الأيام للشهر الحالي
  const generateCalendarDays = () => {
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = endOfMonth.date();
    
    // إضافة الأيام من الشهر السابق
    const prevMonthDays = [];
    const prevMonth = moment(currentMonth).subtract(1, 'month');
    const daysInPrevMonth = prevMonth.daysInMonth();
    for (let i = startDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: moment(prevMonth).date(daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }
    
    // إضافة أيام الشهر الحالي
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: moment(currentMonth).date(i),
        isCurrentMonth: true
      });
    }
    
    // إضافة الأيام من الشهر التالي
    const nextMonthDays = [];
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const remainingDays = 42 - totalDays; // 6 أسابيع × 7 أيام
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: moment(currentMonth).add(1, 'month').date(i),
        isCurrentMonth: false
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              mt: 2,
              boxShadow: 'none',
            }}
          >
            <Typography variant="h5" component="h1" fontWeight="bold">
              مباريات اليوم
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton
                  onClick={() => setShowLeagueFilter(true)}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <FilterListIcon />
                </IconButton>

                <IconButton
                  onClick={handleCalendarClick}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'action.hover',
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                >
                  <CalendarTodayIcon />
                </IconButton>

                <Button
                  onClick={() => setShowLiveOnly(!showLiveOnly)}
                  sx={{
                    height: 40,
                    minWidth: 'unset',
                    textTransform: 'none',
                    px: 2.5,
                    fontSize: '0.75rem',
                    fontWeight: 'medium',
                    bgcolor: showLiveOnly ? '#d32f2f' : '#f2f2f2',
                    color: showLiveOnly ? '#fff' : '#333333',
                    border: '1px solid',
                    borderColor: showLiveOnly ? '#d32f2f' : '#b3b3b3',
                    borderRadius: '8px',
                    '&:hover': {
                      bgcolor: showLiveOnly ? '#c62828' : '#e0e0e0',
                    }
                  }}
                >
                  مباشر
                </Button>
              </Box>

              <IconButton
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
                sx={{
                  bgcolor: 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.selected',
                  }
                }}
              >
                <SettingsIcon />
              </IconButton>
            </Box>
          </Box>

          {/* قائمة الإعدادات للحاسوب */}
          {!isMobile && (
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              PaperProps={{
                sx: { 
                  width: 280,
                  p: 2
                }
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                الإعدادات
              </Typography>
              <SettingsContent />
            </Menu>
          )}

          {/* نافذة الإعدادات للهاتف */}
          {isMobile && (
            <Dialog
              fullScreen={false}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
              TransitionComponent={Slide}
              TransitionProps={{
                direction: "up"
              }}
              PaperProps={{
                sx: {
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  m: 0,
                  maxHeight: '80vh',
                  borderRadius: '16px 16px 0 0',
                  background: theme => theme.palette.background.default,
                  overflowY: 'auto',
                  boxShadow: 'none',
                }
              }}
            >
              <DialogTitle sx={{ pb: 1, position: 'sticky', top: 0, bgcolor: 'background.default', zIndex: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">الإعدادات</Typography>
                  <IconButton 
                    edge="end" 
                    onClick={() => setSettingsAnchor(null)}
                    color="primary"
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent>
                <SettingsContent />
              </DialogContent>
            </Dialog>
          )}

          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between" 
            alignItems={{ xs: 'stretch', sm: 'center' }}
            mb={3}
            gap={2}
          >
            <FormControl 
              sx={{ 
                minWidth: { xs: '100%', sm: 250 },
                '& .MuiSelect-select': {
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }
              }}
            >
            </FormControl>

            <Box 
              display="flex" 
              gap={2}
              width={{ xs: '100%', sm: 'auto' }}
              justifyContent={{ xs: 'space-between', sm: 'flex-start' }}
            >


              <StyledButtonGroup 
                variant="contained"
                sx={{
                  flexGrow: { xs: 1, sm: 0 }
                }}
              >
                <Button 
                  onClick={() => handleDateChange(today.clone().subtract(1, 'day'))}
                  variant={selectedDate === today.clone().subtract(1, 'day').format('YYYY-MM-DD') ? 'contained' : 'outlined'}
                >
                  أمس
                </Button>
                <Button 
                  onClick={() => handleDateChange(today)}
                  variant={selectedDate === today.format('YYYY-MM-DD') ? 'contained' : 'outlined'}
                >
                  اليوم
                </Button>
                <Button 
                  onClick={() => handleDateChange(today.clone().add(1, 'day'))}
                  variant={selectedDate === today.clone().add(1, 'day').format('YYYY-MM-DD') ? 'contained' : 'outlined'}
                >
                  غداً
                </Button>
              </StyledButtonGroup>
            </Box>
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
            Object.entries(displayedMatches).map(([league, leagueMatches]) => (
              <Box key={league} mb={4}>
                <Box 
                  display="flex" 
                  alignItems="center" 
                  mb={2}
                >
                  <Box 
                    sx={{ 
                      width: 4,
                      height: 24,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      mr: 1.5,
                      marginRight: '0'
                    }} 
                  />
                  <Typography 
                    variant="h6" 
                    color="text.primary"
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      marginRight: '6px'
                    }}
                  >
                    {league}
                  </Typography>
                </Box>
                {leagueMatches.map((match, index) => (
                  <MatchCard 
                    key={index} 
                    match={{...match, time: formatTime(match.time)}} 
                    league={league} 
                  />
                ))}
              </Box>
            ))
          )}

          {/* نافذة التقويم */}
          <Dialog
            open={showCalendar}
            onClose={() => setShowCalendar(false)}
            PaperProps={{
              sx: {
                position: 'fixed',
                bottom: 0,
                m: 0,
                width: '100%',
                borderRadius: '16px 16px 0 0',
                bgcolor: 'background.default'
              }
            }}
          >
            <Box>
              {/* شريط السحب */}
              <Box sx={{ py: 2 }}>
                <Box className="touchbar" />
              </Box>

              {/* التقويم */}
              <Box sx={{ px: 3 }}>
                <Box dir="ltr" className="bng-flex bng-justify-center bng-w-full bng-font-Gotham-Arabic">
                  <Box sx={{ width: '100%' }}>
                    {/* عنوان الشهر والسنة */}
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      <IconButton onClick={handlePrevMonth}>
                        <ChevronLeftIcon />
                      </IconButton>
                      <Typography sx={{ fontWeight: 500 }}>
                        {currentMonth.format('MMMM YYYY')}
                      </Typography>
                      <IconButton onClick={handleNextMonth}>
                        <ChevronRightIcon />
                      </IconButton>
                    </Box>

                    {/* أيام الأسبوع */}
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 1,
                        textAlign: 'center',
                        mb: 2
                      }}
                    >
                      {['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'].map(day => (
                        <Typography 
                          key={day} 
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.75rem'
                          }}
                        >
                          {day}
                        </Typography>
                      ))}
                    </Box>

                    {/* أيام الشهر */}
                    <Box 
                      sx={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 1,
                        mb: 3
                      }}
                      className="react-calendar__month-view__days"
                    >
                      {generateCalendarDays().map((day, index) => (
                        <Button
                          key={day.date.format('YYYY-MM-DD')}
                          onClick={() => handleDateChange(day.date)}
                          className={`
                            react-calendar__tile 
                            react-calendar__month-view__days__day
                            ${!day.isCurrentMonth ? 'react-calendar__month-view__days__day--neighboringMonth' : ''}
                            ${day.date.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'react-calendar__tile--now' : ''}
                            ${day.date.format('YYYY-MM-DD') === selectedDate ? 'react-calendar__tile--active' : ''}
                            ${[6, 0].includes(day.date.day()) ? 'react-calendar__month-view__days__day--weekend' : ''}
                          `}
                          TouchRippleProps={{
                            className: 'MuiTouchRipple-root'
                          }}
                          sx={{
                            flex: '0 0 14.2857%',
                            overflow: 'hidden',
                            marginInlineEnd: 0,
                            p: 1,
                            minWidth: 'auto',
                            borderRadius: 1,
                            color: theme => !day.isCurrentMonth ? 'text.disabled' : 'text.primary'
                          }}
                        >
                          <abbr 
                            aria-label={day.date.format('D MMMM YYYY')}
                            style={{
                              textDecoration: 'none',
                              fontWeight: 'normal'
                            }}
                          >
                            {day.date.format('D')}
                          </abbr>
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* أزرار الأسفل */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <Button
                  onClick={() => {
                    handleDateChange(new Date());
                    setShowCalendar(false);
                  }}
                  disabled={selectedDate === moment().format('YYYY-MM-DD')}
                  sx={{
                    width: { xs: 163, md: 190 },
                    fontSize: { xs: '14px', md: '1.125rem' },
                    fontWeight: 'medium',
                    border: '2px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      border: '2px solid',
                      borderColor: 'primary.main',
                      bgcolor: 'transparent'
                    },
                    '&.Mui-disabled': {
                      border: '2px solid',
                      borderColor: 'action.disabled',
                      color: 'action.disabled'
                    }
                  }}
                >
                  اليوم
                </Button>
                <Button
                  onClick={() => setShowCalendar(false)}
                  variant="contained"
                  color="primary"
                  sx={{
                    width: { xs: 163, md: 190 },
                    height: '3rem',
                    fontSize: { xs: '14px', md: '1.125rem' },
                    fontWeight: 'medium',
                    borderRadius: 2,
                    boxShadow: 'none'
                  }}
                >
                  تطبيق
                </Button>
              </Box>
            </Box>
          </Dialog>

          {/* نافذة اختيار الدوريات */}
          <Dialog
            open={showLeagueFilter}
            onClose={() => setShowLeagueFilter(false)}
            PaperProps={{
              sx: {
                position: 'fixed',
                bottom: 0,
                m: 0,
                width: '100%',
                maxHeight: '80vh',
                borderRadius: '16px 16px 0 0',
                bgcolor: 'background.paper'
              }
            }}
          >
            <Box sx={{ height: '100%' }}>
              {/* شريط السحب */}
              <Box sx={{ py: 2 }}>
                <Box 
                  className="touchbar" 
                  sx={{ 
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </Box>

              {/* حقل البحث */}
              <Box sx={{ mx: 3, mb: 2 }}>
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  p: '8px 16px',
                  borderRadius: 2,
                  bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'
                  }
                }}>
                  <SearchIcon sx={{ 
                    color: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                    mr: 1 
                  }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="البحث عن المسابقات والفرق..."
                    className="search-input"
                    style={{
                      color: 'inherit'
                    }}
                  />
                </Box>
              </Box>

              {/* قائمة الدوريات */}
              <Box 
                sx={{ 
                  px: 3,
                  overflow: 'auto'
                }}
                className="no-scrollbar"
              >
                <List>
                  {filteredLeagues.length > 0 ? (
                    filteredLeagues.map((league) => (
                      <MenuItem
                        key={league.id}
                        onClick={() => {
                          if (selectedLeagues.includes(league.id)) {
                            setSelectedLeagues(prev => prev.filter(id => id !== league.id));
                          } else {
                            setSelectedLeagues(prev => [...prev, league.id]);
                          }
                        }}
                        selected={selectedLeagues.includes(league.id)}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          mb: 1,
                          justifyContent: 'right',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          '&.Mui-selected': {
                            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(17, 82, 147, 0.3)' : 'rgba(17, 82, 147, 0.08)',
                            '&:hover': {
                              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(17, 82, 147, 0.4)' : 'rgba(17, 82, 147, 0.12)'
                            }
                          },
                          '&:hover': {
                            bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StadiumIcon color={theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'} />
                          <TvIcon color={theme => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'} />
                        </Box>
                        {league.name}
                      </MenuItem>
                    ))
                  ) : (
                    <Box
                      sx={{
                        py: 4,
                        textAlign: 'center',
                        color: 'text.secondary',
                        fontSize: '14px',
                        paddingTop: '100px',
                        paddingBottom: '220px'
                      }}
                    >
                      لم يتم العثور على نتائج
                    </Box>
                  )}
                </List>
              </Box>

              {/* أزرار الأسفل */}
              <Box
                sx={{
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  p: 3,
                  bgcolor: 'background.default'
                }}
              >
                <Button
                  onClick={() => setSelectedLeagues([])}
                  sx={{
                    width: 163,
                    height: 48,
                    bgcolor: 'transparent',
                    color: 'rgb(17, 82, 147)',
                    borderRadius: 3,
                    fontSize: '14px',
                    border: '1px solid',
                    borderColor: 'rgb(17, 82, 147)'
                  }}
                >
                  اخلاء
                </Button>
                <Button
                  onClick={() => {
                    setSelectedLeague(selectedLeagues[0] || 'all');
                    setShowLeagueFilter(false);
                  }}
                  disabled={selectedLeagues.length === 0}
                  sx={{
                    width: 163,
                    height: 48,
                    bgcolor: selectedLeagues.length === 0 ? '#E6E6E6' : 'rgb(17, 82, 147)',
                    color: selectedLeagues.length === 0 ? '#A6A6A6' : 'white',
                    borderRadius: 3,
                    fontSize: '14px',
                    '&:hover': {
                      bgcolor: selectedLeagues.length === 0 ? '#E6E6E6' : 'rgba(17, 82, 147, 0.9)'
                    },
                    '&.Mui-disabled': {
                      color: selectedLeagues.length === 0 ? '#A6A6A6' : 'white',
                      opacity: 0.5,
                      bgcolor: 'rgb(17, 82, 147)'
                    }
                  }}
                >
                  تطبيق
                </Button>
              </Box>
            </Box>
          </Dialog>
        </Box>
      </Container>
    </Box>
  );
}

export default App;