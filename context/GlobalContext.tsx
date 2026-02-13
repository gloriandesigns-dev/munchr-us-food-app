import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GlobalContextType {
  isVegMode: boolean;
  toggleVegMode: () => void;
  setVegMode: (value: boolean) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isVegMode, setIsVegMode] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  const toggleVegMode = () => setIsVegMode(prev => !prev);
  const setVegModeValue = (value: boolean) => setIsVegMode(value);

  return (
    <GlobalContext.Provider value={{ 
      isVegMode, 
      toggleVegMode, 
      setVegMode: setVegModeValue,
      theme, 
      setTheme 
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
