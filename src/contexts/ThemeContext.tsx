'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyHtmlClass(isDark: boolean) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children, attribute = 'class', defaultTheme = 'system' as ThemeMode }: { children: React.ReactNode; attribute?: 'class'; defaultTheme?: ThemeMode }) {
  // attribute currently unused but kept to mirror next-themes API surface used in layout
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // read from localStorage on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('theme-mode') as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setThemeState(stored);
      }
    } catch {}
    setMounted(true);
  }, []);

  // apply theme to html
  useEffect(() => {
    const isDark = theme === 'system' ? getSystemPrefersDark() : theme === 'dark';
    applyHtmlClass(isDark);

    try {
      window.localStorage.setItem('theme-mode', theme);
    } catch {}

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyHtmlClass(mq.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
    return;
  }, [theme]);

  const value = useMemo<ThemeContextValue>(() => {
    const resolvedTheme: 'light' | 'dark' = theme === 'system' ? (getSystemPrefersDark() ? 'dark' : 'light') : theme;
    return {
      theme,
      setTheme: (mode: ThemeMode) => setThemeState(mode),
      resolvedTheme,
    };
  }, [theme]);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Safe fallback during SSR or when provider not yet mounted
    return {
      theme: 'system' as ThemeMode,
      setTheme: () => undefined,
      resolvedTheme: 'light' as const,
    };
  }
  return ctx;
}


