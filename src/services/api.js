import axios from 'axios';

const PROXY_URL = 'https://api.allorigins.win/raw?url=';
const BASE_URL = 'https://www.filgoal.com/matches/';

// دالة مساعدة لجلب البيانات من URL معين
const fetchFromUrl = async (url) => {
  const response = await axios.get(`${PROXY_URL}${encodeURIComponent(url)}`, {
    headers: {
      'Accept': 'text/html'
    }
  });
  return response.data;
};

const extractCoach = (section) => {
  const coachText = section?.querySelector('a[href="#"]')?.textContent.trim();
  return coachText || null;
};

export const fetchMatchStats = async (matchId) => {
  try {
    const [mainData, coverageData] = await Promise.all([
      fetchFromUrl(`${BASE_URL}${matchId}`),
      fetchFromUrl(`${BASE_URL}${matchId}/coverage`)
    ]);

    const parser = new DOMParser();
    const mainDoc = parser.parseFromString(mainData, 'text/html');
    const stats = { matchInfo: {} };

    // استخراج معلومات المباراة الأساسية
    const matchInfo = mainDoc.querySelector('.match-center-info');
    if (matchInfo) {
      const homeTeamSection = matchInfo.querySelector('.c-i-next .f');
      const awayTeamSection = matchInfo.querySelector('.c-i-next .s');
      const matchAux = matchInfo.querySelector('#match-aux');

      // دالة مساعدة لمعالجة روابط الصور
      const processLogo = (imgElement) => {
        if (!imgElement) return '/images/placeholder-logo.png';
        const src = imgElement.dataset?.src || imgElement.src;
        if (!src || src.includes('placeholder-logo.png')) {
          return '/images/placeholder-logo.png';
        }
        return src.startsWith('//') ? `https:${src}` : src;
      };

      stats.matchInfo = {
        competition: matchInfo.querySelector('h1 a')?.textContent.trim(),
        homeTeam: {
          name: homeTeamSection?.querySelector('strong')?.textContent.trim(),
          logo: processLogo(homeTeamSection?.querySelector('img')),
          score: homeTeamSection?.querySelector('.home-score')?.textContent.trim(),
          coach: extractCoach(homeTeamSection),
          goals: Array.from(homeTeamSection?.querySelectorAll('ul li') || []).map(li => ({
            player: li.querySelector('a')?.textContent.trim(),
            time: li.querySelector('span')?.textContent.trim().replace(/[^0-9]/g, '')
          }))
        },
        awayTeam: {
          name: awayTeamSection?.querySelector('strong')?.textContent.trim(),
          logo: processLogo(awayTeamSection?.querySelector('img')),
          score: awayTeamSection?.querySelector('.away-score')?.textContent.trim(),
          coach: extractCoach(awayTeamSection),
          goals: Array.from(awayTeamSection?.querySelectorAll('ul li') || []).map(li => ({
            player: li.querySelector('a')?.textContent.trim(),
            time: li.querySelector('span')?.textContent.trim().replace(/[^0-9]/g, '')
          }))
        },
        status: matchInfo.querySelector('.status')?.textContent.trim(),
        time: matchInfo.querySelector('.time')?.textContent.trim()
      };

      // استخراج المعلومات الإضافية
      const auxItems = Array.from(matchAux?.querySelectorAll('span') || []);
      auxItems.forEach(item => {
        const text = item.textContent.trim();
        const iconPath = item.querySelector('use')?.getAttribute('xlink:href');
        
        if (iconPath?.includes('field')) {
          stats.matchInfo.venue = text;
        } 
        else if (iconPath?.includes('screen')) {
          stats.matchInfo.channel = text;
        } 
        else if (iconPath?.includes('calendar')) {
          stats.matchInfo.date = text;
        }
        else if (iconPath?.includes('microphone')) {
          stats.matchInfo.commentator = text;
        }
        else if (iconPath?.includes('whistle')) {
          stats.matchInfo.referee = text;
        }
      });
    }

    // ... باقي الكود لاستخراج الإحصائيات الأخرى

    return stats;
  } catch (error) {
    console.error('Error fetching match stats:', error);
    throw error;
  }
};

export const fetchMatches = async (date) => {
  try {
    const response = await fetchFromUrl(`${BASE_URL}?date=${date}`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(response, 'text/html');
    
    const matches = {};
    const matchBlocks = doc.querySelectorAll('#match-list-viewer .mc-block');
    
    const processLogo = (imgElement) => {
      if (!imgElement) return '/images/placeholder-logo.png';
      const src = imgElement.dataset?.src || imgElement.src;
      if (!src || src.includes('placeholder-logo.png')) {
        return '/images/placeholder-logo.png';
      }
      return src.startsWith('//') ? `https:${src}` : src;
    };

    matchBlocks.forEach(block => {
      const leagueName = block.querySelector('h6')?.textContent.trim();
      if (!leagueName) return;
      
      if (!matches[leagueName]) {
        matches[leagueName] = [];
      }
      
      const matchElements = block.querySelectorAll('.cin_cntnr');
      matchElements.forEach(matchElement => {
        const matchLink = matchElement.querySelector('a');
        const matchId = matchLink?.getAttribute('href')?.match(/\/matches\/(\d+)/)?.[1];
        
        if (!matchId) return;

        const homeTeamSection = matchElement.querySelector('.c-i-next .f');
        const awayTeamSection = matchElement.querySelector('.c-i-next .s');
        const statusSection = matchElement.querySelector('.c-i-next .m');
        const matchAux = matchElement.querySelector('.match-aux');

        // تحسين استخراج معلومات الملعب والقناة والوقت والتاريخ
        let venue = '', channel = '', matchTime = '', matchDate = '';
        const auxItems = Array.from(matchAux?.querySelectorAll('span') || []);
        
        auxItems.forEach(item => {
          const text = item.textContent.trim();
          const iconPath = item.querySelector('use')?.getAttribute('xlink:href');
          
          if (iconPath?.includes('field')) {
            venue = text;
          } 
          else if (iconPath?.includes('screen')) {
            channel = text;
          } 
          else if (iconPath?.includes('calendar')) {
            // استخراج الوقت والتاريخ من النص
            const dateTimeMatch = text.match(/(\d{2}-\d{2}-\d{4})\s*-\s*(\d{2}:\d{2})/);
            if (dateTimeMatch) {
              matchDate = dateTimeMatch[1];
              matchTime = dateTimeMatch[2];
            }
          }
        });

        const matchData = {
          id: matchId,
          homeTeam: {
            name: homeTeamSection?.querySelector('strong')?.textContent.trim(),
            logo: processLogo(homeTeamSection?.querySelector('img')),
            score: homeTeamSection?.querySelector('b')?.textContent.trim() || '-'
          },
          awayTeam: {
            name: awayTeamSection?.querySelector('strong')?.textContent.trim(),
            logo: processLogo(awayTeamSection?.querySelector('img')),
            score: awayTeamSection?.querySelector('b')?.textContent.trim() || '-'
          },
          status: statusSection?.querySelector('.status')?.textContent.trim(),
          time: matchTime,
          date: matchDate,
          venue: venue,
          channel: channel,
          icons: {
            venue: 'field',
            channel: 'screen',
            calendar: 'calendar'
          }
        };

        if (matchData.id && matchData.homeTeam.name && matchData.awayTeam.name) {
          matches[leagueName].push(matchData);
        }
      });
    });

    // إزالة البطولات الفارغة
    Object.keys(matches).forEach(key => {
      if (matches[key].length === 0) {
        delete matches[key];
      }
    });

    return matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
};