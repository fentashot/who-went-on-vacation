"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Palette, Check } from "lucide-react";
import { useTheme, THEME_LIST, type Theme } from "@/contexts/theme-context";

export type { Theme };

export function ThemeSelector() {
  const { theme: currentTheme, setTheme } = useTheme();

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
  };

  const currentThemeData =
    THEME_LIST.find((t) => t.name === currentTheme) || THEME_LIST[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="bg-black/10 border-zinc-700/50 text-white hover:bg-black/30 hover:text-white backdrop-blur-sm"
        >
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline mr-2">Theme:</span>
          <div
            className="w-4 h-4 rounded-full border border-white/30 transition-colors duration-500"
            style={{ backgroundColor: currentThemeData.color }}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-zinc-900/85 border-zinc-700/50 backdrop-blur-md"
      >
        {THEME_LIST.map((theme) => (
          <DropdownMenuItem
            key={theme.name}
            onClick={() => handleThemeChange(theme.name)}
            className="cursor-pointer hover:bg-zinc-800/40 focus:bg-zinc-800/40 text-white"
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
