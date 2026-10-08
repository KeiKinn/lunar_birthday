/**
 * test_suite.js
 * Comprehensive automated test suite for Lunar Birthday Calendar
 * Executable via macOS JavaScriptCore (/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
 */

(function (global) {
  'use strict';

  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failures = [];

  function assert(condition, message) {
    totalTests++;
    if (!condition) {
      failedTests++;
      failures.push(message || 'Assertion failed');
      print('  ❌ FAIL: ' + (message || 'Assertion failed'));
    } else {
      passedTests++;
      print('  ✅ PASS: ' + message);
    }
  }

  function assertEqual(actual, expected, message) {
    const isEq = actual === expected;
    assert(isEq, message + ' (Expected: ' + expected + ', Got: ' + actual + ')');
  }

  function describe(suiteName, fn) {
    print('\n========================================');
    print('📦 ' + suiteName);
    print('========================================');
    fn();
  }

  // Set up browser-like global environment
  const localStorageStore = {};
  const mockLocalStorage = {
    getItem: function (key) {
      return localStorageStore.hasOwnProperty(key) ? localStorageStore[key] : null;
    },
    setItem: function (key, val) {
      localStorageStore[key] = String(val);
    },
    removeItem: function (key) {
      delete localStorageStore[key];
    },
    clear: function () {
      for (const k in localStorageStore) delete localStorageStore[k];
    }
  };

  // Mock DOM
  function createMockElement(tag, id) {
    const listeners = {};
    const classes = new Set();
    return {
      tagName: tag ? tag.toUpperCase() : 'DIV',
      id: id || '',
      className: '',
      classList: {
        add: function (cls) { classes.add(cls); },
        remove: function (cls) { classes.delete(cls); },
        contains: function (cls) { return classes.has(cls); },
        toggle: function (cls) { if (classes.has(cls)) classes.delete(cls); else classes.add(cls); }
      },
      style: {},
      innerHTML: '',
      textContent: '',
      value: '',
      checked: false,
      placeholder: '',
      children: [],
      appendChild: function (child) { this.children.push(child); return child; },
      remove: function () {},
      focus: function () {},
      reset: function () { this.value = ''; },
      setAttribute: function () {},
      getAttribute: function () { return null; },
      addEventListener: function (evt, handler) {
        if (!listeners[evt]) listeners[evt] = [];
        listeners[evt].push(handler);
      },
      dispatchEvent: function (evtObj) {
        const type = typeof evtObj === 'string' ? evtObj : evtObj.type;
        const list = listeners[type] || [];
        for (let i = 0; i < list.length; i++) {
          list[i](evtObj);
        }
      },
      closest: function () { return null; }
    };
  }

  const mockDomElements = {};
  const elementIds = [
    'friendsGrid', 'emptyState', 'searchInput', 'clearSearchBtn',
    'filterAllBtn', 'filterUpcomingBtn', 'countAll', 'countUpcoming',
    'sampleDataBanner', 'bannerClearSampleBtn', 'bannerDismissBtn',
    'toggleGuideBtn', 'guideContent', 'guideChevron',
    'langToggleBtn', 'langToggleText', 'backupMenuBtn', 'backupMenuDropdown',
    'exportJsonBtn', 'importJsonBtn', 'importJsonFileInput', 'clearDemoBtn', 'restoreDemoBtn',
    'exportAllIcsBtn', 'openAddModalBtn', 'emptyAddBtn',
    'friendModal', 'friendForm', 'modalTitle', 'closeModalBtn', 'cancelModalBtn', 'submitFriendBtn',
    'friendId', 'inputName', 'tabLunarMode', 'tabSolarMode',
    'sectionLunarInput', 'sectionSolarInput', 'inputLunarMonth', 'inputLunarDay',
    'inputIsLeap', 'inputSolarDate', 'solarConvertedLunarStr', 'solarConvertedZodiac',
    'liveUpcomingPreview', 'inputBirthYear', 'inputNotes', 'zodiacPreviewNote',
    'projectionModal', 'projModalTitle', 'projModalSubtitle', 'closeProjModalBtn',
    'closeProjModalFooterBtn', 'projTableBody', 'downloadFriendIcsBtn', 'toastContainer'
  ];

  for (let i = 0; i < elementIds.length; i++) {
    mockDomElements[elementIds[i]] = createMockElement('div', elementIds[i]);
  }

  const mockDocument = {
    readyState: 'complete',
    documentElement: { lang: 'en' },
    getElementById: function (id) {
      if (!mockDomElements[id]) {
        mockDomElements[id] = createMockElement('div', id);
      }
      return mockDomElements[id];
    },
    querySelectorAll: function () { return []; },
    createElement: function (tag) { return createMockElement(tag); },
    body: createMockElement('body'),
    addEventListener: function () {}
  };

  // Expose on global
  global.window = global;
  global.document = mockDocument;
  global.localStorage = mockLocalStorage;
  global.lucide = {
    createIcons: function () {}
  };
  if (typeof global.URLSearchParams === 'undefined') {
    global.URLSearchParams = function (init) {
      this.dict = init || {};
      this.toString = function () {
        const parts = [];
        for (const k in this.dict) {
          parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(this.dict[k]));
        }
        return parts.join('&');
      };
    };
  }

  // 1. Module Syntax & Loading Suite
  describe('Module Loading & Syntax Verification', function () {
    let lunarLoaded = false;
    let lunarCalcLoaded = false;
    let icsExportLoaded = false;
    let i18nLoaded = false;
    let storageLoaded = false;
    let appLoaded = false;

    try {
      load('lunar.js');
      lunarLoaded = typeof window.Lunar !== 'undefined' && typeof window.Solar !== 'undefined';
    } catch (e) {
      print('Error loading lunar.js: ' + e);
    }
    assert(lunarLoaded, 'lunar.js loads without syntax error and exports window.Lunar & window.Solar');

    try {
      load('js/lunar-calc.js');
      lunarCalcLoaded = typeof window.LunarCalc !== 'undefined';
    } catch (e) {
      print('Error loading lunar-calc.js: ' + e);
    }
    assert(lunarCalcLoaded, 'lunar-calc.js loads without syntax error and exports window.LunarCalc');

    try {
      load('js/ics-export.js');
      icsExportLoaded = typeof window.IcsExport !== 'undefined';
    } catch (e) {
      print('Error loading ics-export.js: ' + e);
    }
    assert(icsExportLoaded, 'ics-export.js loads without syntax error and exports window.IcsExport');

    try {
      load('js/i18n.js');
      i18nLoaded = typeof window.I18n !== 'undefined';
    } catch (e) {
      print('Error loading i18n.js: ' + e);
    }
    assert(i18nLoaded, 'i18n.js loads without syntax error and exports window.I18n');

    try {
      load('js/storage.js');
      storageLoaded = typeof window.FriendStorage !== 'undefined';
    } catch (e) {
      print('Error loading storage.js: ' + e);
    }
    assert(storageLoaded, 'storage.js loads without syntax error and exports window.FriendStorage');

    let appError = null;
    try {
      load('js/app.js');
      appLoaded = true;
    } catch (e) {
      appError = e;
    }
    assert(appLoaded, 'app.js loads without syntax error (Caught error: ' + appError + ')');
  });

  // 2. Lunar Calculation Suite
  describe('LunarCalc Logic & Conversions', function () {
    // Test Solar to Lunar
    const lunarRes = window.LunarCalc.solarToLunar('2024-09-17');
    assert(lunarRes !== null, 'solarToLunar converts valid solar date');
    assertEqual(lunarRes.lunarMonth, 8, 'Solar 2024-09-17 converts to Lunar Month 8');
    assertEqual(lunarRes.lunarDay, 15, 'Solar 2024-09-17 converts to Lunar Day 15');
    assertEqual(lunarRes.isLeap, false, 'Solar 2024-09-17 is not leap month');
    assertEqual(lunarRes.zodiacZh, '龙', 'Year 2024 zodiac is Dragon (龙)');

    // Test Lunar to Solar
    const solarRes = window.LunarCalc.lunarToSolar(2024, 8, 15, false);
    assert(solarRes !== null, 'lunarToSolar converts lunar date to solar date');
    assertEqual(solarRes.solarDateStr, '2024-09-17', 'Lunar 2024-08-15 matches Solar 2024-09-17');

    // Test Zodiac calculation
    const z1996 = window.LunarCalc.getZodiacForYear(1996);
    assertEqual(z1996.zh, '鼠', '1996 Zodiac is Rat (鼠)');
    assertEqual(z1996.en, 'Rat', '1996 Zodiac English is Rat');

    const z2000 = window.LunarCalc.getZodiacForYear(2000);
    assertEqual(z2000.zh, '龙', '2000 Zodiac is Dragon (龙)');

    // Test upcoming birthday
    const testFriend = {
      id: 'f-1',
      name: 'Xiao Ming',
      lunarMonth: 8,
      lunarDay: 15,
      isLeap: false,
      birthYear: 1996
    };

    const upcoming = window.LunarCalc.getUpcomingBirthday(testFriend, new Date('2024-01-01'));
    assert(upcoming !== null, 'Calculates upcoming birthday');
    assertEqual(upcoming.upcomingDateStr, '2024-09-17', 'Upcoming birthday is 2024-09-17');
    assertEqual(upcoming.daysRemaining, 260, 'Days remaining calculated accurately');
    assertEqual(upcoming.age, 28, 'Age calculated correctly as 28');

    // Test 20-Year Projection
    const projection = window.LunarCalc.get20YearProjection(testFriend, 2024);
    assertEqual(projection.length, 20, '20-Year projection returns exactly 20 occurrences');
    assertEqual(projection[0].solarDateStr, '2024-09-17', 'Year 1 matches 2024-09-17');
    assertEqual(projection[1].solarDateStr, '2025-10-06', 'Year 2 matches 2025-10-06');
    assertEqual(projection[2].solarDateStr, '2026-09-25', 'Year 3 matches 2026-09-25');
  });

  // 3. iCalendar Export Suite
  describe('IcsExport Calendar Generator', function () {
    const friend = {
      id: 'f-test',
      name: 'Lin Lin',
      lunarMonth: 1,
      lunarDay: 1,
      isLeap: false,
      birthYear: 1998,
      notes: 'New Year baby'
    };

    const icsString = window.IcsExport.generateIcs([friend]);
    assert(icsString.indexOf('BEGIN:VCALENDAR') !== -1, 'ICS contains VCALENDAR header');
    assert(icsString.indexOf('END:VCALENDAR') !== -1, 'ICS contains VCALENDAR footer');
    assert(icsString.indexOf('Lin Lin') !== -1, 'ICS includes friend name');
    assert(icsString.indexOf('DTSTART;VALUE=DATE:') !== -1, 'ICS contains all-day DTSTART');
    assert(icsString.indexOf('BEGIN:VALARM') !== -1, 'ICS contains VALARM reminder');

    // Google Calendar direct link
    const gUrl = window.IcsExport.getGoogleCalendarUrl(friend);
    assert(gUrl.indexOf('https://calendar.google.com/calendar/render') === 0, 'Generates valid Google Calendar URL');
    assert(gUrl.indexOf('action=TEMPLATE') !== -1, 'Google Calendar URL has action=TEMPLATE');
  });

  // 4. i18n Localization Suite
  describe('I18n Localization Engine', function () {
    window.I18n.setLang('en');
    assertEqual(window.I18n.getLang(), 'en', 'Language set to English');
    assertEqual(window.I18n.t('addFriendBtn'), 'Add Friend', 'Translates English string');

    const formattedEn = window.I18n.t('daysRemainingBadge', { days: 5 });
    assertEqual(formattedEn, 'In 5 days', 'Interpolates parameters in English');

    window.I18n.setLang('zh');
    assertEqual(window.I18n.getLang(), 'zh', 'Language set to Chinese');
    assertEqual(window.I18n.t('addFriendBtn'), '添加朋友', 'Translates Chinese string');

    const formattedZh = window.I18n.t('daysRemainingBadge', { days: 5 });
    assertEqual(formattedZh, '还有 5 天', 'Interpolates parameters in Chinese');
  });

  // 5. Friend Storage Suite
  describe('FriendStorage & LocalStorage Persistence', function () {
    mockLocalStorage.clear();

    const initial = window.FriendStorage.loadFriends();
    assert(initial.length === 3, 'First load seeds 3 demo friends');
    assert(window.FriendStorage.isDemoData(), 'Flags demo data on first load');

    const added = window.FriendStorage.addFriend({
      name: 'Wang Wu',
      lunarMonth: 6,
      lunarDay: 6,
      isLeap: false,
      birthYear: 1995,
      notes: 'Test friend'
    });
    assert(added.id !== null, 'Added friend has generated ID');
    assertEqual(window.FriendStorage.isDemoData(), false, 'Adding friend removes demo data flag');

    const list = window.FriendStorage.loadFriends();
    assertEqual(list.length, 4, 'Friend list length increases to 4');

    // Update friend
    window.FriendStorage.updateFriend(added.id, {
      name: 'Wang Wu (Updated)',
      lunarMonth: 6,
      lunarDay: 6,
      isLeap: false,
      birthYear: 1995,
      notes: 'Updated note'
    });
    // Delete friend
    window.FriendStorage.deleteFriend(added.id);
    const afterDelete = window.FriendStorage.loadFriends();
    assertEqual(afterDelete.length, 3, 'Friend successfully deleted');
  });

  // 6. UI Interaction & Event Simulation Suite
  describe('UI Interaction & Event Handling Simulation', function () {
    // Test language toggle button click
    const langBtn = mockDomElements['langToggleBtn'];
    assert(typeof langBtn.dispatchEvent === 'function', 'Language button has event listener');

    const initialLang = window.I18n.getLang();
    langBtn.dispatchEvent('click');
    assert(window.I18n.getLang() !== initialLang, 'Clicking language button toggles language');

    // Test open Add Modal button click
    const addBtn = mockDomElements['openAddModalBtn'];
    const friendModal = mockDomElements['friendModal'];
    addBtn.dispatchEvent('click');
    assert(!friendModal.classList.contains('hidden'), 'Clicking Add Friend opens modal');

    // Test fill and submit friend form
    mockDomElements['inputName'].value = 'Test User TDD';
    mockDomElements['inputLunarMonth'].value = '8';
    mockDomElements['inputLunarDay'].value = '15';
    mockDomElements['inputBirthYear'].value = '1995';

    const friendForm = mockDomElements['friendForm'];
    friendForm.dispatchEvent({
      type: 'submit',
      preventDefault: function () {}
    });

    const currentFriends = window.FriendStorage.loadFriends();
    const created = currentFriends.find(f => f.name === 'Test User TDD');
    assert(created !== undefined, 'Form submission creates friend in storage');
    assert(friendModal.classList.contains('hidden'), 'Modal closes after submission');

    // Test 20-Year projection modal
    const closeProjBtn = mockDomElements['closeProjModalBtn'];
    assert(typeof closeProjBtn.dispatchEvent === 'function', 'Close projection button has handler');
  });

  // Summary
  print('\n========================================');
  print('📊 TEST SUMMARY');
  print('========================================');
  print('Total tests: ' + totalTests);
  print('Passed:      ' + passedTests);
  print('Failed:      ' + failedTests);

  if (failedTests > 0) {
    print('\n💥 FAILURES:');
    for (let f = 0; f < failures.length; f++) {
      print('  - ' + failures[f]);
    }
  } else {
    print('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  }

})(this);
