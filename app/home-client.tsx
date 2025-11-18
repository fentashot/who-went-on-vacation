"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SteamSearchBar } from "@/components/search/steam-search-bar";
import { ThemeBackground } from "@/components/layout/theme-background";
import { useTheme } from "@/contexts/theme-context";
import { useFetchSteamProfile } from "@/hooks/use-steam-profile";

export function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { themeConfig } = useTheme();
  const {
    mutateAsync: fetchProfile,
    isPending,
    error,
  } = useFetchSteamProfile();

  // Mount animation
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (profileUrl: string) => {
    try {
      await fetchProfile(profileUrl);
      router.push(`/id/${profileUrl}`);
    } catch (err) {
      // Error is handled by React Query and displayed in SteamSearchBar
      console.error("Search failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <ThemeBackground mounted={mounted} themeConfig={themeConfig} />

      <div className="relative min-h-screen flex flex-col items-center">
        <div className="w-full flex flex-col items-center mt-[30vh] px-2">
          <SteamSearchBar
            onSearch={handleSearch}
            loading={isPending}
            error={error?.message ?? null}
            themeConfig={themeConfig}
            showExamples={true}
          />
        </div>
      </div>
    </div>
  );
}
