'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface DarkModeContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const darkMode = (resolvedTheme || theme) === 'dark';
  const toggleDarkMode = () => setTheme(darkMode ? 'light' : 'dark');

  return (
    <DarkModeContext.Provider value={{ darkMode: mounted ? darkMode : false, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be used within DarkModeProvider');
  return ctx;
}


