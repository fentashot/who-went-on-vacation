'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Palette, Check } from 'lucide-react';

export type Theme = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'white';

// LocalStorage key
const THEME_STORAGE_KEY = 'steam-vac-theme';

// Get theme from localStorage
export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'white';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'white'].includes(stored)) {
    return stored as Theme;
  }
  return 'white';
};

// Save theme to localStorage
export const saveTheme = (theme: Theme): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }
};

export interface ThemeConfig {
  gradient: { from: string; via: string; to: string };
  gridColor: string;
  accent: string;
  accentHover: string;
  text: string;
  ring: string;
}

export const getThemeConfig = (theme: Theme): ThemeConfig => {
  const configs: Record<Theme, ThemeConfig> = {
    red: {
      gradient: { from: 'rgba(127, 29, 29, 0.3)', via: 'rgba(127, 29, 29, 0.2)', to: 'rgba(90, 15, 15, 0.1)' },
      gridColor: 'rgba(127, 29, 29, 0.3)',
      accent: 'rgb(220, 38, 38)',
      accentHover: 'rgb(185, 28, 28)',
      text: 'rgb(239, 68, 68)',
      ring: 'rgb(239, 68, 68)',
    },
    blue: {
      gradient: { from: 'rgba(29, 78, 127, 0.25)', via: 'rgba(29, 78, 127, 0.15)', to: 'rgba(15, 52, 90, 0.1)' },
      gridColor: 'rgba(29, 78, 127, 0.3)',
      accent: 'rgb(37, 99, 235)',
      accentHover: 'rgb(29, 78, 216)',
      text: 'rgb(96, 165, 250)',
      ring: 'rgb(96, 165, 250)',
    },
    green: {
      gradient: { from: 'rgba(29, 127, 78, 0.25)', via: 'rgba(29, 127, 78, 0.15)', to: 'rgba(15, 90, 52, 0.1)' },
      gridColor: 'rgba(29, 127, 78, 0.3)',
      accent: 'rgb(22, 163, 74)',
      accentHover: 'rgb(21, 128, 61)',
      text: 'rgb(74, 222, 128)',
      ring: 'rgb(74, 222, 128)',
    },
    yellow: {
      gradient: { from: 'rgba(127, 106, 29, 0.3)', via: 'rgba(127, 106, 29, 0.2)', to: 'rgba(90, 75, 15, 0.1)' },
      gridColor: 'rgba(127, 106, 29, 0.3)',
      accent: 'rgb(202, 138, 4)',
      accentHover: 'rgb(161, 98, 7)',
      text: 'rgb(250, 204, 21)',
      ring: 'rgb(250, 204, 21)',
    },
    purple: {
      gradient: { from: 'rgba(88, 29, 127, 0.3)', via: 'rgba(88, 29, 127, 0.15)', to: 'rgba(62, 15, 90, 0.1)' },
      gridColor: 'rgba(88, 29, 127, 0.3)',
      accent: 'rgb(147, 51, 234)',
      accentHover: 'rgb(126, 34, 206)',
      text: 'rgb(192, 132, 252)',
      ring: 'rgb(192, 132, 252)',
    },
    pink: {
      gradient: { from: 'rgba(127, 29, 88, 0.3)', via: 'rgba(127, 29, 88, 0.15)', to: 'rgba(90, 15, 62, 0.1)' },
      gridColor: 'rgba(127, 29, 88, 0.3)',
      accent: 'rgb(236, 72, 153)',
      accentHover: 'rgb(219, 39, 119)',
      text: 'rgb(244, 114, 182)',
      ring: 'rgb(244, 114, 182)',
    },
    white: {
      gradient: { from: 'rgba(200, 200, 200, 0.12)', via: 'rgba(150, 150, 150, 0.07)', to: 'rgba(100, 100, 100, 0.02)' },
      gridColor: 'rgba(200, 200, 200, 0.1)',
      accent: 'rgb(200, 200, 200, 0.5)',
      accentHover: 'rgb(203, 213, 225, 0.7)',
      text: 'rgb(241, 245, 249)',
      ring: 'rgb(241, 245, 249)',
    },
  };
  return configs[theme];
};

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes: Array<{ name: Theme; label: string; color: string }> = [
  {
    name: 'red',
    label: 'Red',
    color: 'rgb(239, 68, 68)',
  },
  {
    name: 'blue',
    label: 'Blue',
    color: 'rgb(96, 165, 250)',
  },
  {
    name: 'green',
    label: 'Green',
    color: 'rgb(74, 222, 128)',
  },
  {
    name: 'yellow',
    label: 'Yellow',
    color: 'rgb(250, 204, 21)',
  },
  {
    name: 'purple',
    label: 'Purple',
    color: 'rgb(192, 132, 252)',
  },
  {
    name: 'pink',
    label: 'Pink',
    color: 'rgb(244, 114, 182)',
  },
  {
    name: 'white',
    label: 'White',
    color: 'rgb(241, 245, 249)',
  },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const handleThemeChange = (theme: Theme) => {
    saveTheme(theme);
    onThemeChange(theme);
  };

  const currentThemeData = themes.find(t => t.name === currentTheme) || themes[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-black/30 border-zinc-700/50 text-white hover:bg-black/50 hover:text-white backdrop-blur-sm"
        >
          <Palette className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline mr-2">Theme:</span>
          <div
            className="w-4 h-4 rounded-full border border-white/30 transition-colors duration-500"
            style={{ backgroundColor: currentThemeData.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-zinc-900/95 border-zinc-700/50 backdrop-blur-md">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            className="cursor-pointer hover:bg-zinc-800/60 focus:bg-zinc-800/60 text-white"
          >
            <div className="flex items-center gap-3 w-full">
              <div
                className="w-5 h-5 rounded-full border border-white/30 transition-colors duration-300"
                style={{ backgroundColor: theme.color }}
              />
              <span className="flex-1">{theme.label}</span>
              {currentTheme === theme.name && (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getThemeColors(theme: Theme) {
  const colors = {
    red: {
      primary: 'rgb(239, 68, 68)', // red-500
      primaryDark: 'rgb(220, 38, 38)', // red-600
      primaryLight: 'rgb(248, 113, 113)', // red-400
      gradient: 'rgba(127, 29, 29, 0.5)',
      gradientLight: 'rgba(127, 29, 29, 0.3)',
      border: 'rgb(127, 29, 29)',
    },
    blue: {
      primary: 'rgb(59, 130, 246)', // blue-500
      primaryDark: 'rgb(37, 99, 235)', // blue-600
      primaryLight: 'rgb(96, 165, 250)', // blue-400
      gradient: 'rgba(29, 78, 127, 0.5)',
      gradientLight: 'rgba(29, 78, 127, 0.3)',
      border: 'rgb(29, 78, 127)',
    },
    green: {
      primary: 'rgb(34, 197, 94)', // green-500
      primaryDark: 'rgb(22, 163, 74)', // green-600
      primaryLight: 'rgb(74, 222, 128)', // green-400
      gradient: 'rgba(29, 127, 29, 0.5)',
      gradientLight: 'rgba(29, 127, 29, 0.3)',
      border: 'rgb(29, 127, 29)',
    },
    yellow: {
      primary: 'rgb(234, 179, 8)', // yellow-500
      primaryDark: 'rgb(202, 138, 4)', // yellow-600
      primaryLight: 'rgb(250, 204, 21)', // yellow-400
      gradient: 'rgba(127, 100, 29, 0.5)',
      gradientLight: 'rgba(127, 100, 29, 0.3)',
      border: 'rgb(127, 100, 29)',
    },
    purple: {
      primary: 'rgb(168, 85, 247)', // purple-500
      primaryDark: 'rgb(147, 51, 234)', // purple-600
      primaryLight: 'rgb(192, 132, 252)', // purple-400
      gradient: 'rgba(88, 29, 127, 0.5)',
      gradientLight: 'rgba(88, 29, 127, 0.3)',
      border: 'rgb(88, 29, 127)',
    },
    pink: {
      primary: 'rgb(236, 72, 153)', // pink-500
      primaryDark: 'rgb(219, 39, 119)', // pink-600
      primaryLight: 'rgb(244, 114, 182)', // pink-400
      gradient: 'rgba(127, 29, 88, 0.5)',
      gradientLight: 'rgba(127, 29, 88, 0.3)',
      border: 'rgb(127, 29, 88)',
    },
    white: {
      primary: 'rgb(226, 232, 240)', // slate-200
      primaryDark: 'rgb(203, 213, 225)', // slate-300
      primaryLight: 'rgb(241, 245, 249)', // slate-100
      gradient: 'rgba(200, 200, 200, 0.5)',
      gradientLight: 'rgba(150, 150, 150, 0.3)',
      border: 'rgb(200, 200, 200)',
    },
  };

  return colors[theme];
}
