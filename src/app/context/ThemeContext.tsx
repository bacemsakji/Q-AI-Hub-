import React, { createContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved && (saved === 'dark' || saved === 'light')) {
      return saved;
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const isDark = theme === 'dark';

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Update document class
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }

    // Apply CSS variables
    const root = document.querySelector(':root') as HTMLElement;
    if (root) {
      if (isDark) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
      }
    }
  }, [theme, isDark]);

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
