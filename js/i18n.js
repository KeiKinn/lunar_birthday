/**
 * i18n.js
 * Comprehensive English & Chinese translations and cultural guide texts
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'cn_bday_lang';

  const TRANSLATIONS = {
    en: {
      appTitle: 'Lunar Birthday Calendar',
      appSubtitle: 'Never miss your Chinese friends’ birthdays. Calculate Gregorian dates for 20 years & sync to Google Calendar.',
      headerSearchPlaceholder: 'Search by friend name or note...',
      addFriendBtn: 'Add Friend',
      exportAllBtn: 'Export All (20 Years .ics)',
      langToggleZh: '中文',
      langToggleEn: 'English',
      backupRestore: 'Data & Backup',
      exportJson: 'Export Backup (JSON)',
      importJson: 'Import Backup (JSON)',
      clearDemoData: 'Clear Sample Friends',
      restoreDemoData: 'Restore Sample Friends',
      sampleDataNotice: '👋 You are currently viewing sample friends. Feel free to explore, or click to clear sample data.',
      clearSampleBtn: 'Clear Samples',

      // Stats
      statTotalFriends: 'Tracked Friends',
      statNextBirthday: 'Next Birthday',
      statThisMonth: 'Birthdays This Month',

      // Filter tabs
      filterAll: 'All Friends',
      filterUpcoming: 'Upcoming (Next 60 Days)',
      filterLeap: 'Leap Month Babies',

      // Friend Card
      todayBadge: '🎉 TODAY!',
      tomorrowBadge: 'Tomorrow!',
      daysRemainingBadge: 'In {days} days',
      turningAge: 'Turning {age}',
      yearOfZodiac: 'Year of the {zodiac}',
      lunarDateLabel: 'Lunar Date',
      upcomingSolarLabel: 'Next Birthday',
      notesLabel: 'Note',
      leapMonthTag: 'Leap Month',
      addToGoogleCalendar: 'Add to Google Calendar',
      export20YearsIcs: 'Export 20 Years (.ics)',
      view20YearsTable: '20-Year Schedule',
      editBtn: 'Edit',
      deleteBtn: 'Delete',
      confirmDelete: 'Are you sure you want to remove {name} from your birthday list?',

      // Empty State
      emptyTitle: 'No birthdays found',
      emptyDesc: 'Add your first Chinese friend to keep track of their changing lunar birthdays!',
      emptyAddBtn: 'Add First Friend',

      // Modal: Add / Edit
      modalAddTitle: 'Add New Friend',
      modalEditTitle: 'Edit Birthday Info',
      tabLunarMode: '🌙 Input Lunar Date',
      tabSolarMode: '☀️ Convert from Solar Date',
      fieldFriendName: 'Friend Name',
      fieldFriendNamePlaceholder: 'e.g., Xiao Ming, David Li, or Zhang Wei',
      fieldBirthYear: 'Birth Year (Optional)',
      fieldBirthYearPlaceholder: 'e.g., 1996 (enables Age & Zodiac)',
      fieldNotes: 'Relationship / Notes (Optional)',
      fieldNotesPlaceholder: 'e.g., High school friend, College roommate, Loves matcha',

      // Lunar tab form
      lunarMonthLabel: 'Lunar Month',
      lunarDayLabel: 'Lunar Day',
      isLeapCheckbox: 'Born in a Leap Month (闰月)',
      leapExplanation: 'A leap month is an extra 13th month inserted every ~3 years in the Chinese calendar.',
      previewUpcomingTitle: 'Next Birthday (Gregorian)',

      // Solar tab form
      solarPickerLabel: 'Select Gregorian Date',
      solarPickerHint: 'Pick either their original Gregorian birth date or a known solar celebration date.',
      solarConvertedResult: 'Converted Lunar Date',

      // Modal Actions
      modalCancel: 'Cancel',
      modalSave: 'Save Friend',
      modalUpdate: 'Update Friend',

      // 20-Year Schedule Modal
      projectionModalTitle: '{name}’s 20-Year Birthday Schedule',
      projectionModalSubtitle: 'Here are the corresponding Gregorian dates for the next 20 years (from {startYear} to {endYear}):',
      colYear: 'Lunar Year',
      colSolarDate: 'Gregorian Date',
      colDayOfWeek: 'Day of Week',
      colAge: 'Age',
      downloadThis20YearIcs: 'Download This Friend’s 20-Year .ics',
      closeModal: 'Close',

      // Cultural Guide Accordion
      guideTitle: '🏮 Cultural Guide: Understanding Chinese Lunar Birthdays',
      guideIntro: 'Why does your Chinese friend celebrate on a different Gregorian date every year? Here is what you need to know:',
      guideFact1Title: '1. What is the Chinese Lunar Calendar?',
      guideFact1Body: 'The Chinese traditional calendar is a lunisolar calendar based on the moon phases and the solar year. A lunar month has 29 or 30 days, making a lunar year about 11 days shorter than the standard solar (Gregorian) calendar.',
      guideFact2Title: '2. Why does their birthday change on Google Calendar?',
      guideFact2Body: 'Because of the 11-day difference, a fixed lunar date (like 8th Month, 15th Day) shifts by 10 to 20 days on the Gregorian calendar each year. That’s why a regular annual recurrence rule in calendar apps fails, and this tool computes the exact Gregorian date for you!',
      guideFact3Title: '3. What is a "Leap Month" (闰月)?',
      guideFact3Body: 'To prevent the calendar from drifting out of sync with seasons, an extra 13th intercalary month (a "Leap Month") is added about 7 times every 19 years. If someone is born in a leap month, they usually celebrate on the regular month during standard years.',
      guideFact4Title: '4. Chinese Zodiac Animals (生肖)',
      guideFact4Body: 'The Chinese Zodiac follows a 12-year cycle of animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Your birth year determines your zodiac sign!',

      // Alerts & Notifications
      toastAdded: 'Added {name} successfully!',
      toastUpdated: 'Updated {name} successfully!',
      toastDeleted: 'Removed {name}.',
      toastExportedAll: 'Exported 20-year calendar for all friends!',
      toastImportSuccess: 'Successfully imported {count} friends!',
      toastImportError: 'Invalid JSON file. Please check format.',
      toastClearedDemo: 'Cleared sample data.'
    },

    zh: {
      appTitle: '中国农历生日助手',
      appSubtitle: '帮助外国朋友与跨文化家庭轻松记录中国朋友的农历生日，推算未来20年阳历日期并一键导入 Google 日历。',
      headerSearchPlaceholder: '搜索朋友姓名或备注...',
      addFriendBtn: '添加朋友',
      exportAllBtn: '一键导出所有人（20年 .ics）',
      langToggleZh: '中文',
      langToggleEn: 'English',
      backupRestore: '数据备份',
      exportJson: '导出数据备份 (JSON)',
      importJson: '导入数据备份 (JSON)',
      clearDemoData: '清空示例好友',
      restoreDemoData: '恢复示例好友',
      sampleDataNotice: '👋 当前展示的是示例好友数据，方便直观体验，可随时点击清空。',
      clearSampleBtn: '清空示例',

      // Stats
      statTotalFriends: '已记录朋友',
      statNextBirthday: '最近生日',
      statThisMonth: '本月生日',

      // Filter tabs
      filterAll: '全部朋友',
      filterUpcoming: '近期过生日（60天内）',
      filterLeap: '闰月生日',

      // Friend Card
      todayBadge: '🎉 今天过生日！',
      tomorrowBadge: '明天过生日！',
      daysRemainingBadge: '还有 {days} 天',
      turningAge: '即将 {age} 岁',
      yearOfZodiac: '属{zodiac}',
      lunarDateLabel: '农历生日',
      upcomingSolarLabel: '下次阳历生日',
      notesLabel: '备注',
      leapMonthTag: '闰月',
      addToGoogleCalendar: '添加至 Google 日历',
      export20YearsIcs: '导出未来 20 年 (.ics)',
      view20YearsTable: '未来 20 年对照表',
      editBtn: '编辑',
      deleteBtn: '删除',
      confirmDelete: '确定要从生日列表中删除 {name} 吗？',

      // Empty State
      emptyTitle: '暂无生日记录',
      emptyDesc: '添加你的第一位中国朋友，随时掌握他们每年对应的阳历生日！',
      emptyAddBtn: '添加第一位朋友',

      // Modal: Add / Edit
      modalAddTitle: '添加新朋友生日',
      modalEditTitle: '编辑生日信息',
      tabLunarMode: '🌙 按农历录入',
      tabSolarMode: '☀️ 按阳历转换',
      fieldFriendName: '朋友姓名',
      fieldFriendNamePlaceholder: '例如：小明、张伟 或 David Li',
      fieldBirthYear: '出生年份（选填）',
      fieldBirthYearPlaceholder: '例如：1996（用于自动计算岁数与生肖）',
      fieldNotes: '关系/备注（选填）',
      fieldNotesPlaceholder: '例如：大学室友、吃货、喜欢吃抹茶蛋糕',

      // Lunar tab form
      lunarMonthLabel: '农历月份',
      lunarDayLabel: '农历日期',
      isLeapCheckbox: '出生于闰月（Leap Month）',
      leapExplanation: '农历为了协调四季，大约每3年会在年中增加一个闰月。',
      previewUpcomingTitle: '下次阳历对应日期',

      // Solar tab form
      solarPickerLabel: '选择公历/阳历日期',
      solarPickerHint: '输入朋友出生的公历日期，或某一年过生日的公历日期。',
      solarConvertedResult: '换算得到的农历日期',

      // Modal Actions
      modalCancel: '取消',
      modalSave: '保存朋友',
      modalUpdate: '更新朋友',

      // 20-Year Schedule Modal
      projectionModalTitle: '{name} 未来 20 年生日对照表',
      projectionModalSubtitle: '以下是未来 20 年（从 {startYear} 到 {endYear}）每年对应的阳历日期：',
      colYear: '农历年份',
      colSolarDate: '公历/阳历日期',
      colDayOfWeek: '星期',
      colAge: '实岁年龄',
      downloadThis20YearIcs: '下载该好友未来 20 年 .ics 日历文件',
      closeModal: '关闭',

      // Cultural Guide Accordion
      guideTitle: '🏮 文化科普：为什么中国朋友每年过生日的阳历日期都不同？',
      guideIntro: '向外国朋友解释中国农历生日的核心常识：',
      guideFact1Title: '1. 什么是中国农历（阴阳历）？',
      guideFact1Body: '中国农历融合了月相变化（阴历）与太阳运转规律（阳历）。一个农历月为29或30天，一年约354天，比公历少约11天。',
      guideFact2Title: '2. 为什么 Google Calendar 无法直接设置农历重复提醒？',
      guideFact2Body: '由于农历与公历每年相差11天，固定农历月日（如八月十五）在公历日历上每年都会漂移10到20天。标准日历应用的“每年重复”功能无法处理该漂移，因此本工具为您精确预先推算每一年的公历日期！',
      guideFact3Title: '3. 什么是“闰月”？',
      guideFact3Body: '为了保证农历与季节气候吻合，农历大约每19年置7个闰月（在某个月之后重复一次该月）。闰月出生的人，在没有闰月的普通年份通常过正常月份的生日。',
      guideFact4Title: '4. 十二生肖属相（Zodiac）',
      guideFact4Body: '十二生肖以十二年为一循环：鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。出生年份决定了一个人的属相符号！',

      // Alerts & Notifications
      toastAdded: '已成功添加 {name}！',
      toastUpdated: '已更新 {name} 的信息！',
      toastDeleted: '已删除 {name}。',
      toastExportedAll: '已导出全部好友未来 20 年日历文件！',
      toastImportSuccess: '已成功导入 {count} 位好友！',
      toastImportError: 'JSON 文件格式不正确，导入失败。',
      toastClearedDemo: '已清空示例数据。'
    }
  };

  let currentLang = 'en';

  function initLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'zh')) {
        currentLang = saved;
      } else {
        // Default to English as requested
        currentLang = 'en';
      }
    } catch (e) {
      currentLang = 'en';
    }
  }

  function getLang() {
    return currentLang;
  }

  function setLang(lang) {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      // ignore
    }
    document.documentElement.lang = lang;
    if (typeof window.onLanguageChange === 'function') {
      window.onLanguageChange(lang);
    }
  }

  function toggleLang() {
    setLang(currentLang === 'en' ? 'zh' : 'en');
  }

  function t(key, params) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    if (params && typeof params === 'object') {
      for (const p in params) {
        text = text.replace(new RegExp(`\\{${p}\\}`, 'g'), params[p]);
      }
    }
    return text;
  }

  initLang();

  window.I18n = {
    getLang,
    setLang,
    toggleLang,
    t,
    TRANSLATIONS
  };

})(window);
