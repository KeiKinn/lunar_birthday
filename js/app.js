/**
 * app.js
 * Main application coordinator, UI rendering, event handling, and interactions.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    friends: [],
    searchQuery: '',
    activeFilter: 'all', // 'all' | 'upcoming'
    modalMode: 'add',    // 'add' | 'edit'
    inputTab: 'lunar',   // 'lunar' | 'solar'
    activeProjectionFriend: null,
    editingFriendId: null
  };

  // DOM Elements cache
  const elements = {};

  function cacheDom() {
    elements.friendsGrid = document.getElementById('friendsGrid');
    elements.emptyState = document.getElementById('emptyState');
    elements.searchInput = document.getElementById('searchInput');
    elements.clearSearchBtn = document.getElementById('clearSearchBtn');
    elements.filterAllBtn = document.getElementById('filterAllBtn');
    elements.filterUpcomingBtn = document.getElementById('filterUpcomingBtn');
    elements.countAll = document.getElementById('countAll');
    elements.countUpcoming = document.getElementById('countUpcoming');

    elements.sampleDataBanner = document.getElementById('sampleDataBanner');
    elements.bannerClearSampleBtn = document.getElementById('bannerClearSampleBtn');
    elements.bannerDismissBtn = document.getElementById('bannerDismissBtn');

    elements.toggleGuideBtn = document.getElementById('toggleGuideBtn');
    elements.guideContent = document.getElementById('guideContent');
    elements.guideChevron = document.getElementById('guideChevron');

    elements.langToggleBtn = document.getElementById('langToggleBtn');
    elements.langToggleText = document.getElementById('langToggleText');

    elements.backupMenuBtn = document.getElementById('backupMenuBtn');
    elements.backupMenuDropdown = document.getElementById('backupMenuDropdown');
    elements.exportJsonBtn = document.getElementById('exportJsonBtn');
    elements.importJsonBtn = document.getElementById('importJsonBtn');
    elements.importJsonFileInput = document.getElementById('importJsonFileInput');
    elements.clearDemoBtn = document.getElementById('clearDemoBtn');
    elements.restoreDemoBtn = document.getElementById('restoreDemoBtn');

    elements.exportAllIcsBtn = document.getElementById('exportAllIcsBtn');
    elements.openAddModalBtn = document.getElementById('openAddModalBtn');
    elements.emptyAddBtn = document.getElementById('emptyAddBtn');

    // Friend Form Modal
    elements.friendModal = document.getElementById('friendModal');
    elements.friendForm = document.getElementById('friendForm');
    elements.modalTitle = document.getElementById('modalTitle');
    elements.closeModalBtn = document.getElementById('closeModalBtn');
    elements.cancelModalBtn = document.getElementById('cancelModalBtn');
    elements.submitFriendBtn = document.getElementById('submitFriendBtn');
    elements.friendId = document.getElementById('friendId');
    elements.inputName = document.getElementById('inputName');
    elements.tabLunarMode = document.getElementById('tabLunarMode');
    elements.tabSolarMode = document.getElementById('tabSolarMode');
    elements.sectionLunarInput = document.getElementById('sectionLunarInput');
    elements.sectionSolarInput = document.getElementById('sectionSolarInput');
    elements.inputLunarMonth = document.getElementById('inputLunarMonth');
    elements.inputLunarDay = document.getElementById('inputLunarDay');
    elements.inputIsLeap = document.getElementById('inputIsLeap');
    elements.inputSolarDate = document.getElementById('inputSolarDate');
    elements.solarConvertedLunarStr = document.getElementById('solarConvertedLunarStr');
    elements.solarConvertedZodiac = document.getElementById('solarConvertedZodiac');
    elements.liveUpcomingPreview = document.getElementById('liveUpcomingPreview');
    elements.inputBirthYear = document.getElementById('inputBirthYear');
    elements.inputNotes = document.getElementById('inputNotes');
    elements.zodiacPreviewNote = document.getElementById('zodiacPreviewNote');

    // 20-Year Projection Modal
    elements.projectionModal = document.getElementById('projectionModal');
    elements.projModalTitle = document.getElementById('projModalTitle');
    elements.projModalSubtitle = document.getElementById('projModalSubtitle');
    elements.closeProjModalBtn = document.getElementById('closeProjModalBtn');
    elements.closeProjModalFooterBtn = document.getElementById('closeProjModalFooterBtn');
    elements.projTableBody = document.getElementById('projTableBody');
    elements.downloadFriendIcsBtn = document.getElementById('downloadFriendIcsBtn');

    elements.toastContainer = document.getElementById('toastContainer');
  }

  /**
   * Populate month & day selects
   */
  function populateDateSelects() {
    const lang = window.I18n.getLang();
    const monthsZh = window.LunarCalc.LUNAR_MONTH_NAMES_ZH;
    const monthsEn = window.LunarCalc.LUNAR_MONTH_NAMES_EN;
    const daysZh = window.LunarCalc.LUNAR_DAY_NAMES_ZH;

    elements.inputLunarMonth.innerHTML = '';
    for (let m = 1; m <= 12; m++) {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = lang === 'zh'
        ? `${monthsZh[m - 1]} (${m}月)`
        : `${monthsEn[m - 1]} (${monthsZh[m - 1]})`;
      elements.inputLunarMonth.appendChild(opt);
    }

    elements.inputLunarDay.innerHTML = '';
    for (let d = 1; d <= 30; d++) {
      const opt = document.createElement('option');
      opt.value = d;
      opt.textContent = lang === 'zh'
        ? `${daysZh[d - 1]} (${d}日)`
        : `Day ${d} (${daysZh[d - 1]})`;
      elements.inputLunarDay.appendChild(opt);
    }
  }

  /**
   * Update all text content based on current language
   */
  function applyTranslations() {
    const lang = window.I18n.getLang();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        el.textContent = window.I18n.t(key);
      }
    });

    // Update input placeholders
    elements.searchInput.placeholder = window.I18n.t('headerSearchPlaceholder');
    elements.inputName.placeholder = window.I18n.t('fieldFriendNamePlaceholder');
    elements.inputBirthYear.placeholder = window.I18n.t('fieldBirthYearPlaceholder');
    elements.inputNotes.placeholder = window.I18n.t('fieldNotesPlaceholder');

    // Language toggle button text
    elements.langToggleText.textContent = lang === 'en' ? '中文' : 'English';

    // Re-populate select options
    const prevMonth = elements.inputLunarMonth.value;
    const prevDay = elements.inputLunarDay.value;
    populateDateSelects();
    if (prevMonth) elements.inputLunarMonth.value = prevMonth;
    if (prevDay) elements.inputLunarDay.value = prevDay;
  }

  /**
   * Toast notification helper
   */
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `p-4 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-3 transition-all transform duration-300 pointer-events-auto ${
      type === 'error'
        ? 'bg-red-50 text-red-900 border-red-200'
        : 'bg-slate-900 text-white border-slate-800'
    }`;

    toast.innerHTML = `
      <span class="text-base">${type === 'error' ? '⚠️' : '✨'}</span>
      <span>${message}</span>
    `;

    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Refresh friends list and stats
   */
  function loadAndRender() {
    state.friends = window.FriendStorage.loadFriends();

    // Check demo data flag
    const isDemo = window.FriendStorage.isDemoData();
    if (isDemo && state.friends.length > 0) {
      elements.sampleDataBanner.classList.remove('hidden');
    } else {
      elements.sampleDataBanner.classList.add('hidden');
    }

    renderFriends();
  }

  /**
   * Filter and render friends cards
   */
  function renderFriends() {
    const lang = window.I18n.getLang();
    const query = state.searchQuery.toLowerCase().trim();

    // Enrich friends with upcoming birthday calculations
    const enriched = state.friends.map(friend => {
      const upcoming = window.LunarCalc.getUpcomingBirthday(friend);
      return {
        ...friend,
        upcoming
      };
    });

    // Update counts
    elements.countAll.textContent = enriched.length;
    const upcomingCount = enriched.filter(f => f.upcoming && f.upcoming.daysRemaining <= 60).length;
    elements.countUpcoming.textContent = upcomingCount;

    // Filter by search query
    let filtered = enriched.filter(friend => {
      if (!query) return true;
      const matchName = friend.name && friend.name.toLowerCase().includes(query);
      const matchNotes = friend.notes && friend.notes.toLowerCase().includes(query);
      return matchName || matchNotes;
    });

    // Filter by tab
    if (state.activeFilter === 'upcoming') {
      filtered = filtered.filter(f => f.upcoming && f.upcoming.daysRemaining <= 60);
    }

    // Sort by closest birthday first
    filtered.sort((a, b) => {
      const daysA = a.upcoming ? a.upcoming.daysRemaining : 9999;
      const daysB = b.upcoming ? b.upcoming.daysRemaining : 9999;
      return daysA - daysB;
    });

    // Render cards or empty state
    if (filtered.length === 0) {
      elements.friendsGrid.innerHTML = '';
      elements.friendsGrid.classList.add('hidden');
      elements.emptyState.classList.remove('hidden');
    } else {
      elements.emptyState.classList.add('hidden');
      elements.friendsGrid.classList.remove('hidden');
      elements.friendsGrid.innerHTML = filtered.map(friend => createFriendCardHtml(friend, lang)).join('');
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

  /**
   * Build HTML for single friend card
   */
  function createFriendCardHtml(friend, lang) {
    const upcoming = friend.upcoming;
    const lunarFormatted = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, lang);
    const lunarFormattedOther = window.LunarCalc.formatLunarDate(friend.lunarMonth, friend.lunarDay, friend.isLeap, lang === 'zh' ? 'en' : 'zh');

    // Countdown Badge
    let countdownBadgeHtml = '';
    if (upcoming.isToday) {
      countdownBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-600 text-white badge-today shadow-sm">
          ${window.I18n.t('todayBadge')}
        </span>
      `;
    } else if (upcoming.isTomorrow) {
      countdownBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
          ${window.I18n.t('tomorrowBadge')}
        </span>
      `;
    } else {
      countdownBadgeHtml = `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200/80">
          ⏳ ${window.I18n.t('daysRemainingBadge', { days: upcoming.daysRemaining })}
        </span>
      `;
    }

    // Zodiac & Age info
    let zodiacEmoji = '🏮';
    let zodiacText = '';
    if (upcoming.zodiac) {
      zodiacEmoji = upcoming.zodiac.emoji;
      zodiacText = lang === 'zh'
        ? `属${upcoming.zodiac.zh}`
        : `${upcoming.zodiac.en} ${upcoming.zodiac.emoji}`;
    }

    let ageText = '';
    if (upcoming.age !== null) {
      ageText = window.I18n.t('turningAge', { age: upcoming.age });
    }

    // Weekday
    const weekDayStr = lang === 'zh' ? upcoming.weekDayZhFull : upcoming.weekDayEnFull;

    // Google Calendar direct link
    const gcalUrl = window.IcsExport.getGoogleCalendarUrl(friend, upcoming);

    return `
      <div class="friend-card bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between gap-4 relative overflow-hidden" data-id="${friend.id}">
        
        <!-- Card Top Bar: Zodiac Avatar & Name & Status -->
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-50 to-amber-50 border border-red-100 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                ${zodiacEmoji}
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 leading-snug break-words">
                  ${escapeHtml(friend.name)}
                </h3>
                <div class="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  ${ageText ? `<span>${ageText}</span>` : ''}
                  ${ageText && zodiacText ? `<span>•</span>` : ''}
                  ${zodiacText ? `<span>${zodiacText}</span>` : ''}
                </div>
              </div>
            </div>

            <!-- Countdown Pill -->
            <div class="flex-shrink-0">
              ${countdownBadgeHtml}
            </div>
          </div>

          <!-- Highlight Box: Upcoming Solar Date -->
          <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 border border-slate-200/70 space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-slate-400 font-medium">${window.I18n.t('upcomingSolarLabel')}:</span>
              <span class="text-slate-500 font-semibold">${weekDayStr}</span>
            </div>
            <div class="text-lg font-extrabold text-slate-900 tracking-tight">
              ${upcoming.upcomingDateStr}
            </div>
            <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-200/50">
              <span class="text-slate-400 font-medium">${window.I18n.t('lunarDateLabel')}:</span>
              <span class="font-bold text-red-600">
                ${lunarFormatted} <span class="text-slate-400 font-normal">(${lunarFormattedOther})</span>
              </span>
            </div>
          </div>

          <!-- Notes -->
          ${friend.notes ? `
            <div class="mt-3 px-3 py-2 rounded-xl bg-slate-50 text-xs text-slate-600 line-clamp-2">
              <span class="font-medium text-slate-400 mr-1">${window.I18n.t('notesLabel')}:</span>
              ${escapeHtml(friend.notes)}
            </div>
          ` : ''}
        </div>

        <!-- Card Footer: Quick Actions -->
        <div class="pt-3 border-t border-slate-100 flex flex-col gap-2">
          
          <!-- Google Calendar One-Click Sync Link -->
          <a href="${gcalUrl}" target="_blank" rel="noopener noreferrer" class="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm" title="Add this upcoming birthday to your Google Calendar">
            <i data-lucide="calendar-plus" class="w-4 h-4 text-amber-400"></i>
            <span>${window.I18n.t('addToGoogleCalendar')}</span>
          </a>

          <!-- Secondary Action Row -->
          <div class="flex items-center justify-between gap-1.5">
            <button type="button" class="view-projection-btn flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition" data-id="${friend.id}">
              <i data-lucide="calendar-range" class="w-3.5 h-3.5 text-slate-400"></i>
              <span>${window.I18n.t('view20YearsTable')}</span>
            </button>

            <button type="button" class="export-friend-ics-btn p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition" data-id="${friend.id}" title="${window.I18n.t('export20YearsIcs')}">
              <i data-lucide="download" class="w-4 h-4 text-slate-500"></i>
            </button>

            <button type="button" class="edit-friend-btn p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition" data-id="${friend.id}" title="${window.I18n.t('editBtn')}">
              <i data-lucide="edit-3" class="w-4 h-4 text-slate-500"></i>
            </button>

            <button type="button" class="delete-friend-btn p-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition" data-id="${friend.id}" title="${window.I18n.t('deleteBtn')}">
              <i data-lucide="trash-2" class="w-4 h-4 text-red-500"></i>
            </button>
          </div>

        </div>

      </div>
    `;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Open Add/Edit Modal
   */
  function openFriendModal(mode = 'add', friend = null) {
    state.modalMode = mode;
    elements.friendForm.reset();

    if (mode === 'edit' && friend) {
      state.editingFriendId = friend.id;
      elements.modalTitle.textContent = window.I18n.t('modalEditTitle');
      elements.submitFriendBtn.textContent = window.I18n.t('modalUpdate');

      elements.friendId.value = friend.id;
      elements.inputName.value = friend.name;
      elements.inputLunarMonth.value = friend.lunarMonth;
      elements.inputLunarDay.value = friend.lunarDay;
      elements.inputIsLeap.checked = Boolean(friend.isLeap);
      elements.inputBirthYear.value = friend.birthYear || '';
      elements.inputNotes.value = friend.notes || '';

      switchInputTab('lunar');
    } else {
      state.editingFriendId = null;
      elements.modalTitle.textContent = window.I18n.t('modalAddTitle');
      elements.submitFriendBtn.textContent = window.I18n.t('modalSave');

      elements.friendId.value = '';
      elements.inputLunarMonth.value = '8';
      elements.inputLunarDay.value = '15';
      elements.inputIsLeap.checked = false;
      elements.inputBirthYear.value = '';
      elements.inputNotes.value = '';

      switchInputTab('lunar');
    }

    updateLiveUpcomingPreview();
    updateZodiacPreview();

    elements.friendModal.classList.remove('hidden');
    elements.inputName.focus();
  }

  function closeFriendModal() {
    elements.friendModal.classList.add('hidden');
  }

  /**
   * Switch tab between Lunar direct input and Solar date conversion
   */
  function switchInputTab(tab) {
    state.inputTab = tab;
    if (tab === 'lunar') {
      elements.tabLunarMode.className = 'py-2 rounded-xl bg-white shadow-sm text-slate-900 transition flex items-center justify-center gap-1.5';
      elements.tabSolarMode.className = 'py-2 rounded-xl text-slate-500 hover:text-slate-900 transition flex items-center justify-center gap-1.5';
      elements.sectionLunarInput.classList.remove('hidden');
      elements.sectionSolarInput.classList.add('hidden');
    } else {
      elements.tabSolarMode.className = 'py-2 rounded-xl bg-white shadow-sm text-slate-900 transition flex items-center justify-center gap-1.5';
      elements.tabLunarMode.className = 'py-2 rounded-xl text-slate-500 hover:text-slate-900 transition flex items-center justify-center gap-1.5';
      elements.sectionSolarInput.classList.remove('hidden');
      elements.sectionLunarInput.classList.add('hidden');

      if (!elements.inputSolarDate.value) {
        // Default to today's date
        const today = new Date();
        elements.inputSolarDate.value = today.toISOString().split('T')[0];
        handleSolarDateChange();
      }
    }
    updateLiveUpcomingPreview();
  }

  /**
   * Handle Solar date picker change -> convert to Lunar
   */
  function handleSolarDateChange() {
    const val = elements.inputSolarDate.value;
    if (!val) return;

    const res = window.LunarCalc.solarToLunar(val);
    if (res) {
      elements.inputLunarMonth.value = res.lunarMonth;
      elements.inputLunarDay.value = res.lunarDay;
      elements.inputIsLeap.checked = res.isLeap;

      const lang = window.I18n.getLang();
      elements.solarConvertedLunarStr.textContent = lang === 'zh'
        ? `${res.fullZh} (农历 ${res.lunarYear} 年)`
        : `${res.fullEn} (Lunar Year ${res.lunarYear})`;

      elements.solarConvertedZodiac.textContent = res.zodiacEmoji;

      // Auto fill birth year if blank
      if (!elements.inputBirthYear.value) {
        elements.inputBirthYear.value = res.solarYear;
        updateZodiacPreview();
      }

      updateLiveUpcomingPreview();
    }
  }

  /**
   * Update live upcoming Gregorian date preview in modal
   */
  function updateLiveUpcomingPreview() {
    const tempFriend = {
      lunarMonth: Number(elements.inputLunarMonth.value),
      lunarDay: Number(elements.inputLunarDay.value),
      isLeap: elements.inputIsLeap.checked,
      birthYear: elements.inputBirthYear.value ? Number(elements.inputBirthYear.value) : null
    };

    const upcoming = window.LunarCalc.getUpcomingBirthday(tempFriend);
    if (upcoming) {
      const lang = window.I18n.getLang();
      const weekDay = lang === 'zh' ? upcoming.weekDayZh : upcoming.weekDayEn;
      elements.liveUpcomingPreview.textContent = `${upcoming.upcomingDateStr} (${weekDay})`;
    } else {
      elements.liveUpcomingPreview.textContent = '--';
    }
  }

  /**
   * Update Zodiac helper label next to birth year
   */
  function updateZodiacPreview() {
    const val = elements.inputBirthYear.value;
    if (val && !isNaN(val) && Number(val) >= 1900) {
      const zodiac = window.LunarCalc.getZodiacForYear(Number(val));
      if (zodiac) {
        const lang = window.I18n.getLang();
        elements.zodiacPreviewNote.textContent = lang === 'zh'
          ? `生肖属${zodiac.zh} ${zodiac.emoji}`
          : `Zodiac: ${zodiac.en} ${zodiac.emoji}`;
        return;
      }
    }
    elements.zodiacPreviewNote.textContent = window.I18n.t('zodiacPreviewNote') || 'Enables Zodiac & Age';
  }

  /**
   * Form submission
   */
  function handleFriendFormSubmit(e) {
    e.preventDefault();

    const name = elements.inputName.value.trim();
    if (!name) return;

    const friendData = {
      name: name,
      lunarMonth: Number(elements.inputLunarMonth.value),
      lunarDay: Number(elements.inputLunarDay.value),
      isLeap: elements.inputIsLeap.checked,
      birthYear: elements.inputBirthYear.value ? Number(elements.inputBirthYear.value) : null,
      notes: elements.inputNotes.value.trim()
    };

    if (state.modalMode === 'edit' && state.editingFriendId) {
      window.FriendStorage.updateFriend(state.editingFriendId, friendData);
      showToast(window.I18n.t('toastUpdated', { name }));
    } else {
      window.FriendStorage.addFriend(friendData);
      showToast(window.I18n.t('toastAdded', { name }));
    }

    closeFriendModal();
    loadAndRender();
  }

  /**
   * Open 20-Year Schedule Modal
   */
  function openProjectionModal(friend) {
    state.activeProjectionFriend = friend;
    const lang = window.I18n.getLang();
    const startYear = (new Date()).getFullYear();
    const endYear = startYear + 19;

    elements.projModalTitle.textContent = window.I18n.t('projectionModalTitle', { name: friend.name });
    elements.projModalSubtitle.textContent = window.I18n.t('projectionModalSubtitle', { startYear, endYear });

    const projection = window.LunarCalc.get20YearProjection(friend, startYear);

    elements.projTableBody.innerHTML = projection.map(item => {
      const weekDay = lang === 'zh' ? item.weekDayZh : item.weekDayEn;
      const ageStr = item.age !== null ? `${item.age}` : '-';
      const isCurrentYear = item.solarYear === startYear;

      return `
        <tr class="hover:bg-slate-50 transition ${isCurrentYear ? 'bg-red-50/60 font-bold text-red-950' : ''}">
          <td class="py-2.5 px-3">
            ${item.lunarYear} ${item.isLeapCelebrated ? `<span class="text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">${window.I18n.t('leapMonthTag')}</span>` : ''}
          </td>
          <td class="py-2.5 px-3 font-semibold text-slate-900">
            ${item.solarDateStr}
          </td>
          <td class="py-2.5 px-3 text-slate-500">
            ${weekDay}
          </td>
          <td class="py-2.5 px-3 text-right">
            ${ageStr}
          </td>
        </tr>
      `;
    }).join('');

    elements.projectionModal.classList.remove('hidden');
  }

  function closeProjectionModal() {
    elements.projectionModal.classList.add('hidden');
    state.activeProjectionFriend = null;
  }

  /**
   * Event Listeners Registration
   */
  function setupEventListeners() {
    // Language toggle
    elements.langToggleBtn.addEventListener('click', () => {
      window.I18n.toggleLang();
      applyTranslations();
      renderFriends();
    });

    // Backup dropdown menu
    elements.backupMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      elements.backupMenuDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', () => {
      elements.backupMenuDropdown.classList.add('hidden');
    });

    // Export JSON
    elements.exportJsonBtn.addEventListener('click', () => {
      window.FriendStorage.exportToJson();
    });

    // Import JSON
    elements.importJsonBtn.addEventListener('click', () => {
      elements.importJsonFileInput.click();
    });

    elements.importJsonFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = window.FriendStorage.importFromJson(event.target.result);
        if (result.success) {
          showToast(window.I18n.t('toastImportSuccess', { count: result.count }));
          loadAndRender();
        } else {
          showToast(window.I18n.t('toastImportError'), 'error');
        }
        elements.importJsonFileInput.value = '';
      };
      reader.readAsText(file);
    });

    // Clear / Restore Demo friends
    elements.clearDemoBtn.addEventListener('click', () => {
      window.FriendStorage.clearDemoData();
      showToast(window.I18n.t('toastClearedDemo'));
      loadAndRender();
    });

    elements.bannerClearSampleBtn.addEventListener('click', () => {
      window.FriendStorage.clearDemoData();
      showToast(window.I18n.t('toastClearedDemo'));
      loadAndRender();
    });

    elements.bannerDismissBtn.addEventListener('click', () => {
      elements.sampleDataBanner.classList.add('hidden');
    });

    elements.restoreDemoBtn.addEventListener('click', () => {
      window.FriendStorage.restoreDemoData();
      showToast(window.I18n.t('restoreDemoData'));
      loadAndRender();
    });

    // Export all friends to .ics
    elements.exportAllIcsBtn.addEventListener('click', () => {
      if (state.friends.length === 0) {
        showToast(window.I18n.t('emptyTitle'), 'error');
        return;
      }
      window.IcsExport.downloadAllFriends20YearIcs(state.friends);
      showToast(window.I18n.t('toastExportedAll'));
    });

    // Add friend modal buttons
    elements.openAddModalBtn.addEventListener('click', () => openFriendModal('add'));
    elements.emptyAddBtn.addEventListener('click', () => openFriendModal('add'));
    elements.closeModalBtn.addEventListener('click', closeFriendModal);
    elements.cancelModalBtn.addEventListener('click', closeFriendModal);

    // Modal tabs
    elements.tabLunarMode.addEventListener('click', () => switchInputTab('lunar'));
    elements.tabSolarMode.addEventListener('click', () => switchInputTab('solar'));

    // Modal input changes for live preview
    elements.inputLunarMonth.addEventListener('change', updateLiveUpcomingPreview);
    elements.inputLunarDay.addEventListener('change', updateLiveUpcomingPreview);
    elements.inputIsLeap.addEventListener('change', updateLiveUpcomingPreview);
    elements.inputSolarDate.addEventListener('change', handleSolarDateChange);
    elements.inputBirthYear.addEventListener('input', () => {
      updateZodiacPreview();
      updateLiveUpcomingPreview();
    });

    // Form submit
    elements.friendForm.addEventListener('submit', handleFriendFormSubmit);

    // 20-Year projection modal
    elements.closeProjModalBtn.addEventListener('click', closeProjectionModal);
    elements.closeProjModalFooterBtn.addEventListener('click', closeProjectionModal);
    elements.downloadFriendIcsBtn.addEventListener('click', () => {
      if (state.activeProjectionFriend) {
        window.IcsExport.downloadFriend20YearIcs(state.activeProjectionFriend);
      }
    });

    // Search and filter
    elements.searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (state.searchQuery) {
        elements.clearSearchBtn.classList.remove('hidden');
      } else {
        elements.clearSearchBtn.classList.add('hidden');
      }
      renderFriends();
    });

    elements.clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      renderFriends();
    });

    elements.filterAllBtn.addEventListener('click', () => {
      state.activeFilter = 'all';
      elements.filterAllBtn.className = 'px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-white text-slate-900 shadow-sm transition';
      elements.filterUpcomingBtn.className = 'px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl text-slate-600 hover:text-slate-900 transition';
      renderFriends();
    });

    elements.filterUpcomingBtn.addEventListener('click', () => {
      state.activeFilter = 'upcoming';
      elements.filterUpcomingBtn.className = 'px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-white text-slate-900 shadow-sm transition';
      elements.filterAllBtn.className = 'px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-xl text-slate-600 hover:text-slate-900 transition';
      renderFriends();
    });

    // Cultural guide toggle
    elements.toggleGuideBtn.addEventListener('click', () => {
      const isHidden = elements.guideContent.classList.contains('hidden');
      if (isHidden) {
        elements.guideContent.classList.remove('hidden');
        elements.guideChevron.style.transform = 'rotate(180deg)';
      } else {
        elements.guideContent.classList.add('hidden');
        elements.guideChevron.style.transform = 'rotate(0deg)';
      }
    });

    // Delegated events for cards grid (Edit, Delete, View Projection, Export Single .ics)
    elements.friendsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('[data-id]');
      if (!card) return;
      const friendId = card.getAttribute('data-id');
      const friend = state.friends.find(f => f.id === friendId);
      if (!friend) return;

      // Edit Button
      if (e.target.closest('.edit-friend-btn')) {
        openFriendModal('edit', friend);
        return;
      }

      // Delete Button
      if (e.target.closest('.delete-friend-btn')) {
        const confirmMsg = window.I18n.t('confirmDelete', { name: friend.name });
        if (confirm(confirmMsg)) {
          window.FriendStorage.deleteFriend(friendId);
          showToast(window.I18n.t('toastDeleted', { name: friend.name }));
          loadAndRender();
        }
        return;
      }

      // View 20-Year Schedule Button
      if (e.target.closest('.view-projection-btn')) {
        openProjectionModal(friend);
        return;
      }

      // Export Single Friend .ics Button
      if (e.target.closest('.export-friend-ics-btn')) {
        window.IcsExport.downloadFriend20YearIcs(friend);
        return;
      }
    });

    // Keyboard shortcuts (Escape closes modals)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeFriendModal();
        closeProjectionModal();
      }
    });
  }

  // Application initialization
  function init() {
    cacheDom();
    setupEventListeners();
    populateDateSelects();
    applyTranslations();
    loadAndRender();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
