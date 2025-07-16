import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Force light mode always
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    setIsLoading(false);
  }, []);

  // Disable system theme change listener
  // useEffect(() => {
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
  //   const handleChange = (e) => {
  //     // Only update if user hasn't set a manual preference
  //     if (!localStorage.getItem('theme')) {
  //       setIsDarkMode(e.matches);
  //       if (e.matches) {
  //         document.documentElement.classList.add('dark');
  //       } else {
  //         document.documentElement.classList.remove('dark');
  //       }
  //     }
  //   };

  //   mediaQuery.addEventListener('change', handleChange);
  //   return () => mediaQuery.removeEventListener('change', handleChange);
  // }, []);

  const toggleTheme = () => {
    // Force light mode - disable toggle
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  const setTheme = (theme) => {
    // Force light mode regardless of input
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  };

  const value = {
    isDarkMode,
    toggleTheme,
    setTheme,
    isLoading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
