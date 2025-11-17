"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SteamSearchBar } from "@/components/search/steam-search-bar";
import { ThemeBackground } from "@/components/layout/theme-background";
import { useTheme } from "@/contexts/theme-context";
import { useProfile } from "@/contexts/profile-context";

export function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { themeConfig } = useTheme();
  const { loading, error, fetchAndSetProfile, clearError } = useProfile();

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (profileUrl: string) => {
    clearError();
    const success = await fetchAndSetProfile(profileUrl);
    if (success) {
      router.push(`/id/${profileUrl}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ThemeBackground mounted={mounted} themeConfig={themeConfig} />

      <div className="relative min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col items-center mt-[30vh]">
          <SteamSearchBar
            onSearch={handleSearch}
            loading={loading}
            error={error}
            themeConfig={themeConfig}
            showExamples={true}
          />
        </div>
      </div>
    </div>
  );
}
