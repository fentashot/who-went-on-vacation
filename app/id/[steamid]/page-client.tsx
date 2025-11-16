"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { UserProfileCard } from "@/components/profile/user-profile-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SteamSearchBar } from "@/components/search/steam-search-bar";
import { FriendsFilterToggle } from "@/components/friends/friends-filter-toggle";
import { SortButton } from "@/components/friends/sort-button";
import { FriendsSearchBar } from "@/components/friends/friends-search-bar";
import { GridSizeSlider } from "@/components/layout/grid-size-slider";
import { ErrorMessage } from "@/components/shared/error-message";
import { FriendsList } from "@/components/friends/friends-list";
import { useSteamProfile } from "@/hooks/use-steam-profile";
import { type SortOrder } from "@/types/steam";
import { useTheme } from "@/contexts/theme-context";

import {
  getStoredGridSize,
  saveGridSize,
  filterAndSortFriends,
} from "@/lib/utils";

import { ThemeSelector } from "@/components/layout/theme-selector";

interface PageClientProps {
  steamid: string;
}

export function PageClient({ steamid }: PageClientProps) {
  const router = useRouter();
  const { themeConfig } = useTheme();

  // Use custom hook for Steam profile data
  const { loading, result, error, fetchProfile } = useSteamProfile();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showOnlyBanned, setShowOnlyBanned] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [gridSize, setGridSize] = useState<number | null>(null);

  // Initialize gridSize and mount animation
  useEffect(() => {
    // Load gridSize from localStorage
    const loadSettings = () => {
      setGridSize(getStoredGridSize());
    };

    requestAnimationFrame(loadSettings);

    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch profile on steamid change
  useEffect(() => {
    if (steamid) {
      fetchProfile(steamid);
    }
  }, [steamid, fetchProfile]);

  const handleSearch = (profileUrl: string) => {
    router.push(`/id/${profileUrl}`);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    saveGridSize(newSize);
  };

  const filteredAndSortedFriends = useMemo(() => {
    if (!result) return [];

    const friendsToShow = showOnlyBanned
      ? result.bannedFriends
      : result.allFriends;
    if (!friendsToShow) return [];

    return filterAndSortFriends(friendsToShow, searchQuery, sortOrder);
  }, [result, showOnlyBanned, searchQuery, sortOrder]);

  // Show black screen until gridSize loads
  if (gridSize === null) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div
      className="min-h-screen bg-black text-white relative"
      suppressHydrationWarning
      style={
        {
          "--theme-gradient-from": themeConfig.gradient.from,
          "--theme-gradient-via": themeConfig.gradient.via,
          "--theme-gradient-to": themeConfig.gradient.to,
          "--theme-grid-color": themeConfig.gridColor,
        } as React.CSSProperties
      }
    >
      {/* Background */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        <div
          className={`absolute inset-0 background-grid transition-opacity duration-800 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundSize: `${gridSize}px ${gridSize}px` }}
          suppressHydrationWarning
        />
        <div
          className={`absolute inset-0 background-gradient transition-opacity duration-800 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
          suppressHydrationWarning
        />
      </div>

      {/* Page */}
      <div className="relative min-h-screen flex flex-col items-center py-10">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <GridSizeSlider value={gridSize} onChange={handleGridSizeChange} />
          <ThemeSelector />
        </div>

        {/* Content */}
        <div className="w-full max-w-6xl px-4 mt-8">
          {/* Search Bar */}
          <div className="mb-8">
            <SteamSearchBar
              onSearch={handleSearch}
              loading={loading}
              themeConfig={themeConfig}
              showHeader={false}
              showExamples={false}
              placeholder={steamid}
            />
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} themeConfig={themeConfig} />}

          {/* Loading State */}
          {loading && !result && <LoadingSkeleton />}

          {/* Results */}
          {result && (
            <div className="w-full space-y-14">
              {/* User Profile */}
              {result.userProfile && (
                <div>
                  <UserProfileCard profile={result.userProfile} />
                </div>
              )}

              {/* Friends Section */}
              <div className="space-y-10 px-2">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {result.message}
                  </h2>
                  {result.totalFriends !== undefined && (
                    <FriendsFilterToggle
                      showOnlyBanned={showOnlyBanned}
                      onToggle={setShowOnlyBanned}
                      totalFriends={result.totalFriends}
                      bannedCount={result.bannedFriends.length}
                      themeConfig={themeConfig}
                    />
                  )}
                </div>

                {(
                  showOnlyBanned
                    ? result.bannedFriends.length > 0
                    : result.allFriends.length > 0
                ) ? (
                  <>
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 md:px-12 lg:px-2">
                      <FriendsSearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                      />
                      <div className="flex gap-2">
                        <SortButton
                          order="newest"
                          icon={ArrowUp}
                          label="Newest"
                          currentSortOrder={sortOrder}
                          onSort={setSortOrder}
                          themeConfig={themeConfig}
                        />
                        <SortButton
                          order="oldest"
                          icon={ArrowDown}
                          label="Oldest"
                          currentSortOrder={sortOrder}
                          onSort={setSortOrder}
                          themeConfig={themeConfig}
                        />
                      </div>
                    </div>

                    {searchQuery && (
                      <p className="text-sm text-gray-400 mb-3">
                        Showing {filteredAndSortedFriends.length} of{" "}
                        {showOnlyBanned
                          ? result.bannedFriends.length
                          : result.allFriends.length}{" "}
                        {showOnlyBanned ? "banned friends" : "friends"}
                      </p>
                    )}

                    <FriendsList
                      friends={filteredAndSortedFriends}
                      searchQuery={searchQuery}
                      themeConfig={themeConfig}
                    />
                  </>
                ) : result.totalFriends !== undefined ? (
                  <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md">
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-400 text-lg">
                        🎉 None of your friends have VAC or game bans!
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
