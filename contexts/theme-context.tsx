"use client";

import { createContext, useContext, useState, useTransition } from "react";
import {
  setThemeInCookies,
  setGridSizeInCookies,
  setCompactViewInCookies,
} from "@/lib/theme-actions";

export type Theme =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "white";

export interface ThemeConfig {
  gradient: { from: string; via: string; to: string };
  gridColor: string;
  accent: string;
  accentHover: string;
  text: string;
  ring: string;
  border: string;
}

export interface ThemeMetadata {
  name: Theme;
  label: string;
  color: string;
}

export const THEME_CONFIGS: Record<Theme, ThemeConfig> = {
  red: {
    gradient: {
      from: "rgba(127, 29, 29, 0.3)",
      via: "rgba(127, 29, 29, 0.2)",
      to: "rgba(90, 15, 15, 0.1)",
    },
    gridColor: "rgba(127, 29, 29, 0.3)",
    accent: "rgb(220, 38, 38)",
    accentHover: "rgb(185, 28, 28)",
    text: "rgb(239, 68, 68)",
    ring: "rgb(239, 68, 68)",
    border: "rgb(127, 29, 29)",
  },
  blue: {
    gradient: {
      from: "rgba(29, 78, 127, 0.25)",
      via: "rgba(29, 78, 127, 0.15)",
      to: "rgba(15, 52, 90, 0.1)",
    },
    gridColor: "rgba(29, 78, 127, 0.3)",
    accent: "rgb(37, 99, 235)",
    accentHover: "rgb(29, 78, 216)",
    text: "rgb(96, 165, 250)",
    ring: "rgb(96, 165, 250)",
    border: "rgb(29, 78, 127)",
  },
  green: {
    gradient: {
      from: "rgba(29, 127, 78, 0.25)",
      via: "rgba(29, 127, 78, 0.15)",
      to: "rgba(15, 90, 52, 0.1)",
    },
    gridColor: "rgba(29, 127, 78, 0.3)",
    accent: "rgb(22, 163, 74)",
    accentHover: "rgb(21, 128, 61)",
    text: "rgb(74, 222, 128)",
    ring: "rgb(74, 222, 128)",
    border: "rgb(29, 127, 29)",
  },
  yellow: {
    gradient: {
      from: "rgba(127, 106, 29, 0.3)",
      via: "rgba(127, 106, 29, 0.2)",
      to: "rgba(90, 75, 15, 0.1)",
    },
    gridColor: "rgba(127, 106, 29, 0.3)",
    accent: "rgb(202, 138, 4)",
    accentHover: "rgb(161, 98, 7)",
    text: "rgb(250, 204, 21)",
    ring: "rgb(250, 204, 21)",
    border: "rgb(127, 100, 29)",
  },
  purple: {
    gradient: {
      from: "rgba(88, 29, 127, 0.3)",
      via: "rgba(88, 29, 127, 0.15)",
      to: "rgba(62, 15, 90, 0.1)",
    },
    gridColor: "rgba(88, 29, 127, 0.3)",
    accent: "rgb(147, 51, 234)",
    accentHover: "rgb(126, 34, 206)",
    text: "rgb(192, 132, 252)",
    ring: "rgb(192, 132, 252)",
    border: "rgb(88, 29, 127)",
  },
  pink: {
    gradient: {
      from: "rgba(127, 29, 88, 0.3)",
      via: "rgba(127, 29, 88, 0.15)",
      to: "rgba(90, 15, 62, 0.1)",
    },
    gridColor: "rgba(127, 29, 88, 0.3)",
    accent: "rgb(236, 72, 153)",
    accentHover: "rgb(219, 39, 119)",
    text: "rgb(244, 114, 182)",
    ring: "rgb(244, 114, 182)",
    border: "rgb(127, 29, 88)",
  },
  white: {
    gradient: {
      from: "rgba(200, 200, 200, 0.12)",
      via: "rgba(150, 150, 150, 0.07)",
      to: "rgba(100, 100, 100, 0.02)",
    },
    gridColor: "rgba(200, 200, 200, 0.1)",
    accent: "rgb(200, 200, 200, 0.5)",
    accentHover: "rgb(203, 213, 225, 0.7)",
    text: "rgb(241, 245, 249)",
    ring: "rgb(241, 245, 249)",
    border: "rgb(200, 200, 200)",
  },
};

export const THEME_LIST: ThemeMetadata[] = [
  { name: "red", label: "Red", color: "rgb(239, 68, 68)" },
  { name: "blue", label: "Blue", color: "rgb(96, 165, 250)" },
  { name: "green", label: "Green", color: "rgb(74, 222, 128)" },
  { name: "yellow", label: "Yellow", color: "rgb(250, 204, 21)" },
  { name: "purple", label: "Purple", color: "rgb(192, 132, 252)" },
  { name: "pink", label: "Pink", color: "rgb(244, 114, 182)" },
  { name: "white", label: "White", color: "rgb(241, 245, 249)" },
];

export function getThemeConfig(theme: Theme): ThemeConfig {
  return THEME_CONFIGS[theme];
}

interface ThemeContextType {
  theme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  isPending: boolean;
  gridSize: number;
  setGridSize: (size: number) => void;
  compactView: boolean;
  setCompactView: (compact: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme: Theme;
  initialGridSize: number;
  initialCompactView: boolean;
}

export function ThemeProvider({
  children,
  initialTheme,
  initialGridSize,
  initialCompactView,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);
  const [gridSize, setGridSizeState] = useState<number>(initialGridSize);
  const [compactView, setCompactViewState] =
    useState<boolean>(initialCompactView);
  const [isPending, startTransition] = useTransition();

  const setTheme = (newTheme: Theme) => {
    // Use transition for smooth color changes
    startTransition(() => {
      setThemeState(newTheme);
    });

    // Save to cookies in background
    setThemeInCookies(newTheme).catch((error) => {
      console.error("Failed to save theme preference:", error);
    });
  };

  const setGridSize = (newSize: number) => {
    // Update state immediately for instant slider response
    setGridSizeState(newSize);

    // Save to cookies in background
    setGridSizeInCookies(newSize).catch((error) => {
      console.error("Failed to save grid size preference:", error);
    });
  };

  const setCompactView = (newCompact: boolean) => {
    // Update state immediately for instant UI response
    setCompactViewState(newCompact);

    // Save to cookies in background without blocking
    setCompactViewInCookies(newCompact).catch((error) => {
      console.error("Failed to save compact view preference:", error);
    });
  };

  const themeConfig = getThemeConfig(theme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        setTheme,
        isPending,
        gridSize,
        setGridSize,
        compactView,
        setCompactView,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
