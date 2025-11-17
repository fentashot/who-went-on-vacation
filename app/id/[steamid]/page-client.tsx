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
import { ViewToggle } from "@/components/layout/view-toggle";
import { useSteamProfile } from "@/hooks/use-steam-profile";
import { type SortOrder } from "@/types/steam";
import { useTheme } from "@/contexts/theme-context";
import { ThemeBackground } from "@/components/layout/theme-background";

import { filterAndSortFriends } from "@/lib/utils";

import { ThemeSelector } from "@/components/layout/theme-selector";

interface PageClientProps {
  steamid: string;
}

export function PageClient({ steamid }: PageClientProps) {
  const router = useRouter();
  const { themeConfig, gridSize } = useTheme();

  // Use custom hook for Steam profile data
  const { loading, result, error, fetchProfile } = useSteamProfile();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showOnlyBanned, setShowOnlyBanned] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Mount animation
  useEffect(() => {
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

  const filteredAndSortedFriends = useMemo(() => {
    if (!result) return [];

    const friendsToShow = showOnlyBanned
      ? result.bannedFriends
      : result.allFriends;
    if (!friendsToShow) return [];

    return filterAndSortFriends(friendsToShow, searchQuery, sortOrder);
  }, [result, showOnlyBanned, searchQuery, sortOrder]);

  return (
    <div
      className="min-h-screen bg-black text-white relative"
      suppressHydrationWarning
    >
      <ThemeBackground
        mounted={mounted}
        themeConfig={themeConfig}
        gridSize={gridSize}
      />

      {/* Page */}
      <div className="relative min-h-screen flex flex-col items-center py-10">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <ViewToggle />
          <GridSizeSlider />
          <ThemeSelector />
        </div>
        {/* Content */}
        <div className="w-full max-w-7xl px-4 mt-8">
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
          {error && !loading && <ErrorMessage message={error} themeConfig={themeConfig} />}

          {/* Loading State */}
          {loading && !result && !error && <LoadingSkeleton />}

          {/* Results */}
          {result && !error && (
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
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 lg:px-2">
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
