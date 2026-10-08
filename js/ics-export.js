/**
 * ics-export.js
 * Generates standard RFC 5545 iCalendar (.ics) files and Google Calendar quick-add links
 * for 20-year lunar birthday schedules.
 */

(function (window) {
  'use strict';

  function pad(num) {
    return String(num).padStart(2, '0');
  }

  /**
   * Format date as YYYYMMDD
   */
  function formatDateCompact(year, month, day) {
    return `${year}${pad(month)}${pad(day)}`;
  }

  /**
   * Format the day immediately after a given date (for exclusive DTEND in iCal)
   */
  function formatNextDayCompact(year, month, day) {
    const nextDate = new Date(year, month - 1, day + 1);
    return `${nextDate.getFullYear()}${pad(nextDate.getMonth() + 1)}${pad(nextDate.getDate())}`;
  }

  /**
   * Format current timestamp as UTC YYYYMMDDTHHMMSSZ
   */
  function getTimestampCompact() {
    const now = new Date();
    return (
      now.getUTCFullYear() +
      pad(now.getUTCMonth() + 1) +
      pad(now.getUTCDate()) +
      'T' +
      pad(now.getUTCHours()) +
      pad(now.getUTCMinutes()) +
      pad(now.getUTCSeconds()) +
      'Z'
    );
  }

  /**
   * Escape special characters in iCalendar text fields
   */
  function escapeIcsText(str) {
    if (!str) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\r?\n/g, '\\n');
  }

  function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /**
   * Generate VEVENT block for a single occurrence
   */
  function generateVEvent(friend, occurrence, dtstamp) {
    const dtstart = formatDateCompact(occurrence.solarYear, occurrence.solarMonth, occurrence.solarDay);
    const dtend = formatNextDayCompact(occurrence.solarYear, occurrence.solarMonth, occurrence.solarDay);
    const uid = `lunar-bday-${friend.id}-${occurrence.lunarYear}-${dtstart}@lunarbirthday.app`;

    const lunarTextZh = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, 'zh');
    const lunarTextEn = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, 'en');

    let summary = `🎂 ${friend.name}'s Lunar Birthday (${lunarTextZh})`;
    if (occurrence.age !== null) {
      summary = `🎂 ${friend.name}'s ${getOrdinal(occurrence.age)} Lunar Birthday (${lunarTextZh})`;
    }

    const descLines = [
      `Happy Lunar Birthday to ${friend.name}!`,
      `Lunar Date: ${lunarTextEn} (${lunarTextZh})`,
      occurrence.age !== null ? `Age: Turning ${occurrence.age} years old` : null,
      friend.birthYear ? `Birth Year: ${friend.birthYear}` : null,
      friend.notes ? `Notes: ${friend.notes}` : null,
      '',
      '📅 Tracked with Lunar Birthday Calendar'
    ].filter(Boolean);

    const description = escapeIcsText(descLines.join('\n'));

    return [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${escapeIcsText(summary)}`,
      `DESCRIPTION:${description}`,
      'STATUS:CONFIRMED',
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${escapeIcsText(friend.name)}'s Lunar Birthday tomorrow!`,
      'TRIGGER:-P1D',
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  }

  /**
   * Generate complete .ics content for one or multiple friends
   */
  function generateIcs(friendsList, calendarName) {
    if (!Array.isArray(friendsList)) {
      friendsList = [friendsList];
    }

    const dtstamp = getTimestampCompact();
    const calName = calendarName || 'Chinese Lunar Birthdays (20 Years)';

    const vEvents = [];

    friendsList.forEach(friend => {
      const projection = window.LunarCalc.get20YearProjection(friend);
      projection.forEach(occ => {
        vEvents.push(generateVEvent(friend, occ, dtstamp));
      });
    });

    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LunarBirthdayCalendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${escapeIcsText(calName)}`,
      'X-WR-TIMEZONE:UTC',
      vEvents.join('\r\n'),
      'END:VCALENDAR'
    ];

    return lines.join('\r\n');
  }

  /**
   * Trigger browser download of an .ics file
   */
  function downloadIcs(filename, icsContent) {
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /**
   * Download 20-year .ics file for a single friend
   */
  function downloadFriend20YearIcs(friend) {
    const safeName = (friend.name || 'Friend').trim().replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '_');
    const filename = `${safeName}_lunar_birthdays_20years.ics`;
    const icsContent = generateIcs([friend], `${friend.name}'s Lunar Birthday (20-Year Schedule)`);
    downloadIcs(filename, icsContent);
  }

  /**
   * Download bundled 20-year .ics file for all friends
   */
  function downloadAllFriends20YearIcs(friendsList) {
    const filename = `all_friends_lunar_birthdays_20years.ics`;
    const icsContent = generateIcs(friendsList, 'All Friends Chinese Lunar Birthdays (20 Years)');
    downloadIcs(filename, icsContent);
  }

  /**
   * Generate Google Calendar direct web URL for upcoming birthday
   * Clicking this opens calendar.google.com with the event pre-filled
   */
  function getGoogleCalendarUrl(friend, upcoming) {
    if (!upcoming) {
      upcoming = window.LunarCalc.getUpcomingBirthday(friend);
    }
    if (!upcoming) return '#';

    const startStr = formatDateCompact(upcoming.upcomingYear, upcoming.upcomingMonth, upcoming.upcomingDay);
    const endStr = formatNextDayCompact(upcoming.upcomingYear, upcoming.upcomingMonth, upcoming.upcomingDay);

    const lunarTextZh = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, 'zh');
    const lunarTextEn = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, 'en');

    let title = `🎂 ${friend.name}'s Lunar Birthday (${lunarTextZh})`;
    if (upcoming.age !== null) {
      title = `🎂 ${friend.name}'s ${getOrdinal(upcoming.age)} Lunar Birthday (${lunarTextZh})`;
    }

    const descLines = [
      `Happy Lunar Birthday to ${friend.name}!`,
      `Lunar Date: ${lunarTextEn} (${lunarTextZh})`,
      upcoming.age !== null ? `Age: Turning ${upcoming.age} years old` : null,
      friend.birthYear ? `Birth Year: ${friend.birthYear}` : null,
      friend.notes ? `Notes: ${friend.notes}` : null,
      '',
      '📅 Tracked with Lunar Birthday Calendar'
    ].filter(Boolean);

    const details = descLines.join('\n');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startStr}/${endStr}`,
      details: details,
      sf: 'true',
      output: 'xml'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  // Export to global window
  window.IcsExport = {
    generateIcs,
    downloadIcs,
    downloadFriend20YearIcs,
    downloadAllFriends20YearIcs,
    getGoogleCalendarUrl
  };

})(window);
