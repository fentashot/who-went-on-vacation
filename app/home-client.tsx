"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SteamSearchBar } from "@/components/search/steam-search-bar";
import { useTheme } from "@/contexts/theme-context";

export function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { themeConfig } = useTheme();

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (profileUrl: string) => {
    router.push(`/id/${profileUrl}`);
  };

  return (
    <div
      className="min-h-screen bg-black text-white relative"
      style={
        {
          "--theme-gradient-from": themeConfig.gradient.from,
          "--theme-gradient-via": themeConfig.gradient.via,
          "--theme-gradient-to": themeConfig.gradient.to,
          "--theme-grid-color": themeConfig.gridColor,
        } as React.CSSProperties
      }
    >
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div
          className={`absolute inset-0 background-grid transition-opacity duration-1200 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-0 background-gradient transition-opacity duration-1200 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      <div className="relative min-h-screen flex flex-col items-center">
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
