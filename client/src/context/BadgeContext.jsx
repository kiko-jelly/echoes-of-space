import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchBadges } from '../services/api';

const BadgeContext = createContext();

export function BadgeProvider({ children }) {
  const [badges, setBadges] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('echoes_unlocked_badges');
      return saved ? JSON.parse(saved) : ['badge-first-step'];
    } catch {
      return ['badge-first-step'];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [recentNotification, setRecentNotification] = useState(null);

  useEffect(() => {
    fetchBadges()
      .then(data => setBadges(data))
      .catch(err => console.error('Error loading badges:', err));
  }, []);

  const unlockBadge = (badgeId) => {
    if (unlockedIds.includes(badgeId)) return;

    const newUnlocked = [...unlockedIds, badgeId];
    setUnlockedIds(newUnlocked);
    localStorage.setItem('echoes_unlocked_badges', JSON.stringify(newUnlocked));

    const badgeObj = badges.find(b => b.id === badgeId);
    if (badgeObj) {
      setRecentNotification(badgeObj);
      setTimeout(() => setRecentNotification(null), 5000);
    }
  };

  return (
    <BadgeContext.Provider value={{
      badges,
      unlockedIds,
      unlockBadge,
      isDrawerOpen,
      setIsDrawerOpen,
      recentNotification,
      clearNotification: () => setRecentNotification(null)
    }}>
      {children}
    </BadgeContext.Provider>
  );
}

export function useBadges() {
  return useContext(BadgeContext);
}
