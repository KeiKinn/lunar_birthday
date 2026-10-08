/**
 * storage.js
 * Handles LocalStorage persistence, demo friends data, and JSON import/export
 */

(function (window) {
  'use strict';

  const STORAGE_KEY = 'cn_birthday_friends_v1';
  const DEMO_FLAG_KEY = 'cn_birthday_is_demo_v1';

  const DEFAULT_DEMO_FRIENDS = [
    {
      id: 'demo-1',
      name: 'Xiao Ming (小明)',
      lunarMonth: 8,
      lunarDay: 15,
      isLeap: false,
      birthYear: 1996,
      notes: 'College roommate • Loves hotpot & Mid-Autumn mooncakes',
      createdAt: 1704067200000
    },
    {
      id: 'demo-2',
      name: 'Lin Lin (林林)',
      lunarMonth: 1,
      lunarDay: 1,
      isLeap: false,
      birthYear: 1998,
      notes: 'Born on Chinese New Year! • UI Designer friend',
      createdAt: 1704153600000
    },
    {
      id: 'demo-3',
      name: 'Chen Chen (晨晨)',
      lunarMonth: 5,
      lunarDay: 5,
      isLeap: false,
      birthYear: 2000,
      notes: 'Dragon Boat Festival baby 🐉 • Tech enthusiast',
      createdAt: 1704240000000
    }
  ];

  function loadFriends() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error loading friends from localStorage:', e);
    }

    // First time visit: initialize with demo friends
    saveFriends(DEFAULT_DEMO_FRIENDS);
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
    return [...DEFAULT_DEMO_FRIENDS];
  }

  function saveFriends(friends) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(friends));
    } catch (e) {
      console.error('Error saving friends to localStorage:', e);
    }
  }

  function isDemoData() {
    return localStorage.getItem(DEMO_FLAG_KEY) === 'true';
  }

  function clearDemoData() {
    saveFriends([]);
    localStorage.removeItem(DEMO_FLAG_KEY);
  }

  function restoreDemoData() {
    saveFriends(DEFAULT_DEMO_FRIENDS);
    localStorage.setItem(DEMO_FLAG_KEY, 'true');
  }

  function addFriend(friendData) {
    const friends = loadFriends();
    const newFriend = {
      id: 'friend_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      name: (friendData.name || 'Friend').trim(),
      lunarMonth: Number(friendData.lunarMonth),
      lunarDay: Number(friendData.lunarDay),
      isLeap: Boolean(friendData.isLeap),
      birthYear: friendData.birthYear ? Number(friendData.birthYear) : null,
      notes: (friendData.notes || '').trim(),
      createdAt: Date.now()
    };
    friends.unshift(newFriend);
    saveFriends(friends);
    localStorage.removeItem(DEMO_FLAG_KEY);
    return newFriend;
  }

  function updateFriend(id, friendData) {
    const friends = loadFriends();
    const index = friends.findIndex(f => f.id === id);
    if (index === -1) return null;

    friends[index] = {
      ...friends[index],
      name: (friendData.name || 'Friend').trim(),
      lunarMonth: Number(friendData.lunarMonth),
      lunarDay: Number(friendData.lunarDay),
      isLeap: Boolean(friendData.isLeap),
      birthYear: friendData.birthYear ? Number(friendData.birthYear) : null,
      notes: (friendData.notes || '').trim(),
      updatedAt: Date.now()
    };

    saveFriends(friends);
    return friends[index];
  }

  function deleteFriend(id) {
    const friends = loadFriends();
    const filtered = friends.filter(f => f.id !== id);
    saveFriends(filtered);
    if (filtered.length === 0) {
      localStorage.removeItem(DEMO_FLAG_KEY);
    }
    return filtered;
  }

  function exportToJson() {
    const friends = loadFriends();
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      friends: friends
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lunar_birthdays_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      let list = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && Array.isArray(parsed.friends)) {
        list = parsed.friends;
      } else {
        return { success: false, error: 'Invalid structure' };
      }

      // Validate items
      const valid = list.filter(item => item && item.name && item.lunarMonth && item.lunarDay);
      if (valid.length === 0) {
        return { success: false, error: 'No valid friends found in JSON' };
      }

      const existing = loadFriends();
      const existingIds = new Set(existing.map(f => f.id));

      const merged = [...existing];
      valid.forEach(item => {
        if (!item.id || existingIds.has(item.id)) {
          item.id = 'imported_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
        }
        merged.unshift(item);
      });

      saveFriends(merged);
      localStorage.removeItem(DEMO_FLAG_KEY);
      return { success: true, count: valid.length };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  window.FriendStorage = {
    loadFriends,
    saveFriends,
    addFriend,
    updateFriend,
    deleteFriend,
    isDemoData,
    clearDemoData,
    restoreDemoData,
    exportToJson,
    importFromJson
  };

})(window);
