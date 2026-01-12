import React, { createContext, useContext, useMemo, useState } from 'react';
import { createTheme, PaletteMode } from '@mui/material';

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
  theme: ReturnType<typeof createTheme>;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = 'avito-theme-mode';

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as PaletteMode | null;
    return stored ?? 'light';
  });

  const toggleMode = () => {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#2563eb' },
          secondary: { main: '#f97316' }
        },
        shape: { borderRadius: 8 }
      }),
    [mode]
  );

  const value: ColorModeContextValue = { mode, toggleMode, theme };

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorModeTheme = () => {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorModeTheme must be used within provider');
  return ctx;
};
