'use client';

import { useState, useEffect } from 'react';
import { ThemeSelector, type Theme, getThemeConfig, getStoredTheme } from '@/components/theme-selector';
import { SteamSearchBar } from '@/components/steam-search-bar';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return getStoredTheme();
    }
    return 'white';
  });
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = getThemeConfig(currentTheme);

  const handleSearch = (profileUrl: string) => {
    router.push(`/id/${profileUrl}`);
  };

  return (
    <div className="min-h-screen bg-black text-white relative" style={{
      '--theme-gradient-from': themeConfig.gradient.from,
      '--theme-gradient-via': themeConfig.gradient.via,
      '--theme-gradient-to': themeConfig.gradient.to,
      '--theme-grid-color': themeConfig.gridColor,
    } as React.CSSProperties}>

      <div className="fixed inset-0 bg-black pointer-events-none">
        <div className={`absolute inset-0 background-grid transition-opacity duration-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 background-gradient transition-opacity duration-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative min-h-screen flex flex-col items-center">
        <div className="absolute top-4 right-4 z-10">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>

        <div className="w-full flex flex-col items-center mt-[30vh]">
          <SteamSearchBar
            onSearch={handleSearch}
            loading={false}
            themeConfig={themeConfig}
            showExamples={true}
          />
        </div>
      </div>
    </div>
  );
}
