/**
 * lunar-calc.js
 * High-accuracy Lunar / Solar calendar calculations for birthday tracking
 * Powered by lunar.js (window.Lunar, window.Solar)
 */

(function (window) {
  'use strict';

  const ZODIAC_DATA = [
    { zh: '鼠', en: 'Rat', emoji: '🐀' },
    { zh: '牛', en: 'Ox', emoji: '🐂' },
    { zh: '虎', en: 'Tiger', emoji: '🐅' },
    { zh: '兔', en: 'Rabbit', emoji: '🐇' },
    { zh: '龙', en: 'Dragon', emoji: '🐉' },
    { zh: '蛇', en: 'Snake', emoji: '🐍' },
    { zh: '马', en: 'Horse', emoji: '🐎' },
    { zh: '羊', en: 'Goat', emoji: '🐐' },
    { zh: '猴', en: 'Monkey', emoji: '🐒' },
    { zh: '鸡', en: 'Rooster', emoji: '🐓' },
    { zh: '狗', en: 'Dog', emoji: '🐕' },
    { zh: '猪', en: 'Pig', emoji: '🐖' }
  ];

  const LUNAR_MONTH_NAMES_ZH = [
    '正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '冬月', '腊月'
  ];

  const LUNAR_MONTH_NAMES_EN = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const LUNAR_DAY_NAMES_ZH = [
    '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
  ];

  const WEEKDAY_NAMES = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    enFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    zh: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
    zhFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  };

  /**
   * Get Zodiac animal details for a given Gregorian or Lunar year
   */
  function getZodiacForYear(year) {
    if (!year || isNaN(year)) return null;
    // 1900 was Year of the Rat (index 0)
    const index = (Math.abs(Number(year) - 1900) % 12);
    // Alternatively (year - 4) % 12: 2024 - 4 = 2020 % 12 = 4 (Dragon)
    const normIndex = (Math.floor(Number(year)) - 4) % 12;
    const finalIndex = normIndex < 0 ? (normIndex + 12) : normIndex;
    return ZODIAC_DATA[finalIndex] || ZODIAC_DATA[0];
  }

  /**
   * Convert Gregorian date (YYYY-MM-DD or Date object) to Lunar details
   */
  function solarToLunar(solarDateInput) {
    if (!window.Solar) {
      console.error('lunar.js not loaded!');
      return null;
    }

    let y, m, d;
    if (typeof solarDateInput === 'string') {
      const parts = solarDateInput.split('-').map(Number);
      y = parts[0];
      m = parts[1];
      d = parts[2];
    } else if (solarDateInput instanceof Date) {
      y = solarDateInput.getFullYear();
      m = solarDateInput.getMonth() + 1;
      d = solarDateInput.getDate();
    } else {
      return null;
    }

    try {
      const solar = window.Solar.fromYmd(y, m, d);
      const lunar = solar.getLunar();
      const rawMonth = lunar.getMonth(); // negative if leap month
      const isLeap = rawMonth < 0;
      const absMonth = Math.abs(rawMonth);
      const day = lunar.getDay();

      const zodiacChar = lunar.getYearShengXiao();
      const zodiacMatch = ZODIAC_DATA.find(z => z.zh === zodiacChar) || getZodiacForYear(lunar.getYear());

      return {
        solarYear: y,
        solarMonth: m,
        solarDay: d,
        solarDateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        lunarYear: lunar.getYear(),
        lunarMonth: absMonth,
        lunarDay: day,
        isLeap: isLeap,
        monthZh: (isLeap ? '闰' : '') + (LUNAR_MONTH_NAMES_ZH[absMonth - 1] || `${absMonth}月`),
        monthEn: (isLeap ? 'Lunar Leap-' : 'Lunar ') + (LUNAR_MONTH_NAMES_EN[absMonth - 1] || `Month ${absMonth}`),
        dayZh: LUNAR_DAY_NAMES_ZH[day - 1] || `第${day}天`,
        dayEn: `Day ${day}`,
        fullZh: `${isLeap ? '闰' : ''}${LUNAR_MONTH_NAMES_ZH[absMonth - 1] || `${absMonth}月`}${LUNAR_DAY_NAMES_ZH[day - 1] || day}`,
        fullEn: `Lunar ${isLeap ? 'Leap-' : ''}${LUNAR_MONTH_NAMES_EN[absMonth - 1] || `Month ${absMonth}`} ${day}`,
        zodiacZh: zodiacChar,
        zodiacEn: zodiacMatch ? zodiacMatch.en : '',
        zodiacEmoji: zodiacMatch ? zodiacMatch.emoji : '🐉'
      };
    } catch (err) {
      console.error('solarToLunar error:', err);
      return null;
    }
  }

  /**
   * Given lunar month, day, and leap flag, calculate the Gregorian date for a specific lunar year
   * Gracefully falls back to normal month if this year lacks that leap month.
   */
  function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap) {
    if (!window.Lunar) {
      console.error('lunar.js not loaded!');
      return null;
    }

    const y = Number(lunarYear);
    const m = Math.abs(Number(lunarMonth));
    const d = Number(lunarDay);

    let lunarObj = null;
    let actualIsLeap = isLeap;

    if (isLeap) {
      try {
        lunarObj = window.Lunar.fromYmd(y, -m, d);
      } catch (e) {
        // Year lacks this leap month, fall back to standard month
        actualIsLeap = false;
        try {
          lunarObj = window.Lunar.fromYmd(y, m, d);
        } catch (e2) {
          return null;
        }
      }
    } else {
      try {
        lunarObj = window.Lunar.fromYmd(y, m, d);
      } catch (e) {
        return null;
      }
    }

    if (!lunarObj) return null;

    const solar = lunarObj.getSolar();
    const sy = solar.getYear();
    const sm = solar.getMonth();
    const sd = solar.getDay();
    const solarDateStr = `${sy}-${String(sm).padStart(2, '0')}-${String(sd).padStart(2, '0')}`;
    const jsDate = new Date(sy, sm - 1, sd);
    const dayOfWeek = jsDate.getDay();

    return {
      solarYear: sy,
      solarMonth: sm,
      solarDay: sd,
      solarDateStr: solarDateStr,
      jsDate: jsDate,
      dayOfWeek: dayOfWeek,
      weekDayZh: WEEKDAY_NAMES.zh[dayOfWeek],
      weekDayZhFull: WEEKDAY_NAMES.zhFull[dayOfWeek],
      weekDayEn: WEEKDAY_NAMES.en[dayOfWeek],
      weekDayEnFull: WEEKDAY_NAMES.enFull[dayOfWeek],
      actualIsLeap: actualIsLeap
    };
  }

  /**
   * Calculate upcoming birthday details for a friend
   * Computes the nearest upcoming occurrence (today or future)
   */
  function getUpcomingBirthday(friend, refDate) {
    const today = refDate || new Date();
    // Zero out time components for date-only comparison
    const todayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const currentYear = todayZero.getFullYear();

    const candidates = [];

    // Check occurrences across neighboring lunar years (currentYear - 1 to currentYear + 2)
    for (let testYear = currentYear - 1; testYear <= currentYear + 2; testYear++) {
      const res = lunarToSolar(testYear, friend.lunarMonth, friend.lunarDay, friend.isLeap);
      if (res) {
        candidates.push({
          lunarYear: testYear,
          ...res
        });
      }
    }

    // Sort by chronological solar date
    candidates.sort((a, b) => a.jsDate - b.jsDate);

    // Find the first candidate whose date is >= todayZero
    let nextEvent = candidates.find(c => c.jsDate >= todayZero);
    if (!nextEvent && candidates.length > 0) {
      nextEvent = candidates[candidates.length - 1];
    }

    if (!nextEvent) return null;

    const diffMs = nextEvent.jsDate.getTime() - todayZero.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const isToday = diffDays === 0;

    let age = null;
    if (friend.birthYear && !isNaN(friend.birthYear)) {
      age = nextEvent.solarYear - Number(friend.birthYear);
      if (age < 0) age = null;
    }

    const zodiac = friend.birthYear ? getZodiacForYear(friend.birthYear) : null;

    return {
      upcomingDateStr: nextEvent.solarDateStr,
      upcomingYear: nextEvent.solarYear,
      upcomingMonth: nextEvent.solarMonth,
      upcomingDay: nextEvent.solarDay,
      jsDate: nextEvent.jsDate,
      daysRemaining: diffDays,
      isToday: isToday,
      isTomorrow: diffDays === 1,
      age: age,
      zodiac: zodiac,
      weekDayZh: nextEvent.weekDayZh,
      weekDayZhFull: nextEvent.weekDayZhFull,
      weekDayEn: nextEvent.weekDayEn,
      weekDayEnFull: nextEvent.weekDayEnFull,
      isLeapCelebrated: nextEvent.actualIsLeap
    };
  }

  /**
   * Generate 20-year projection of Gregorian dates for this friend's lunar birthday
   * Covers from startYear up to startYear + 19 (total 20 occurrences)
   */
  function get20YearProjection(friend, startYear) {
    const startY = startYear || (new Date()).getFullYear();
    const list = [];

    for (let i = 0; i < 20; i++) {
      const targetLunarYear = startY + i;
      const res = lunarToSolar(targetLunarYear, friend.lunarMonth, friend.lunarDay, friend.isLeap);
      if (res) {
        let age = null;
        if (friend.birthYear && !isNaN(friend.birthYear)) {
          age = res.solarYear - Number(friend.birthYear);
          if (age < 0) age = null;
        }

        list.push({
          index: i + 1,
          lunarYear: targetLunarYear,
          solarYear: res.solarYear,
          solarMonth: res.solarMonth,
          solarDay: res.solarDay,
          solarDateStr: res.solarDateStr,
          jsDate: res.jsDate,
          weekDayZh: res.weekDayZh,
          weekDayEn: res.weekDayEn,
          weekDayEnFull: res.weekDayEnFull,
          isLeapCelebrated: res.actualIsLeap,
          age: age
        });
      }
    }

    return list;
  }

  /**
   * Format friend's lunar date as human-readable string
   */
  function formatLunarDate(lunarMonth, lunarDay, isLeap, lang) {
    const m = Math.abs(Number(lunarMonth));
    const d = Number(lunarDay);
    const leapStrZh = isLeap ? '闰' : '';
    const leapStrEn = isLeap ? 'Leap-' : '';

    if (lang === 'zh') {
      const mName = LUNAR_MONTH_NAMES_ZH[m - 1] || `${m}月`;
      const dName = LUNAR_DAY_NAMES_ZH[d - 1] || `${d}日`;
      return `${leapStrZh}${mName}${dName}`;
    } else {
      const mName = LUNAR_MONTH_NAMES_EN[m - 1] || `Month ${m}`;
      return `Lunar ${leapStrEn}${mName} ${d}`;
    }
  }

  // Export to global window
  window.LunarCalc = {
    ZODIAC_DATA,
    LUNAR_MONTH_NAMES_ZH,
    LUNAR_MONTH_NAMES_EN,
    LUNAR_DAY_NAMES_ZH,
    WEEKDAY_NAMES,
    getZodiacForYear,
    solarToLunar,
    lunarToSolar,
    getUpcomingBirthday,
    get20YearProjection,
    formatLunarDate
  };

})(window);
