import React, { createContext, useContext, useState, useEffect } from 'react';

const ModeContext = createContext();

export function ModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('echoes_mode') || 'story';
  });

  useEffect(() => {
    localStorage.setItem('echoes_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prev => (prev === 'story' ? 'explorer' : 'story'));
  };

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, isStory: mode === 'story' }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
