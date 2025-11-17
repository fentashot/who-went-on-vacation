"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { UserProfileCard } from "@/components/profile/user-profile-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { SteamSearchBar } from "@/components/search/steam-search-bar";
import { FriendsFilterToggle } from "@/components/friends/friends-filter-toggle";
import { SortButton } from "@/components/friends/sort-button";
import { FriendsSearchBar } from "@/components/friends/friends-search-bar";
import { FriendsList } from "@/components/friends/friends-list";
import { ViewToggle } from "@/components/layout/view-toggle";
import { GridSizeSlider } from "@/components/layout/grid-size-slider";
import { ThemeSelector } from "@/components/layout/theme-selector";
import { ThemeBackground } from "@/components/layout/theme-background";

// Contexts & Types
import { useProfile } from "@/contexts/profile-context";
import { useTheme } from "@/contexts/theme-context";
import { type SortOrder } from "@/types/steam";

// Utils
import { filterAndSortFriends } from "@/lib/utils";
import { LeetifyStats } from "@/components/profile/leetify-stats";

interface PageClientProps {
  steamid: string;
}

export function PageClient({ steamid }: PageClientProps) {
  const router = useRouter();
  const { themeConfig, gridSize } = useTheme();
  const { currentProfile, loading, error, fetchAndSetProfile } = useProfile();

  console.log(currentProfile?.userProfile);

  // UI State
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showOnlyBanned, setShowOnlyBanned] = useState(true);

  // Mount animation effect
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch profile on mount if needed
  useEffect(() => {
    if (steamid && !currentProfile && !error) {
      fetchAndSetProfile(steamid);
    }
  }, [steamid, currentProfile, error, fetchAndSetProfile]);

  // Handlers
  const handleSearch = async (profileUrl: string) => {
    const success = await fetchAndSetProfile(profileUrl);
    if (success) {
      router.push(`/id/${profileUrl}`);
    }
  };

  // Computed values
  const friendsToDisplay = useMemo(() => {
    return showOnlyBanned
      ? currentProfile?.bannedFriends ?? []
      : currentProfile?.allFriends ?? [];
  }, [showOnlyBanned, currentProfile]);

  const filteredAndSortedFriends = useMemo(
    () => filterAndSortFriends(friendsToDisplay, searchQuery, sortOrder),
    [friendsToDisplay, searchQuery, sortOrder]
  );

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

      <div className="relative min-h-screen flex flex-col items-center py-10">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <ViewToggle />
          <GridSizeSlider />
          <ThemeSelector />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl px-4 mt-8">

          {/* Search Bar */}
          <div className="mb-10 mx-auto space-y-10 max-w-3xl">
            <SteamSearchBar
              onSearch={handleSearch}
              loading={loading}
              error={error}
              themeConfig={themeConfig}
              showHeader={false}
              showExamples={false}
              placeholder={steamid}
            />
          </div>

          {/* Loading State */}
          {loading && !currentProfile && <LoadingSkeleton />}
          {/* <LoadingSkeleton /> */}
          {/* Profile Results */}
          {currentProfile && (
            <div className="w-full space-y-14 mx-auto">
              <div className="max-w-5xl mx-auto">
                {/* User Profile Card */}
                {/* <div className="grid">
                  {currentProfile.userProfile && (
                    <UserProfileCard profile={currentProfile.userProfile} />
                  )}
                </div> */}

                <div className="grid lg:grid-cols-3 gap-4 ">
                  {currentProfile.userProfile?.steamid && (
                    <LeetifyStats
                    />
                  )}
                </div>
              </div>

              {/* Friends Section */}
              <div className="space-y-10">
                {/* Section Header */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {currentProfile.message}
                  </h2>
                  {currentProfile.totalFriends !== undefined && (
                    <FriendsFilterToggle
                      showOnlyBanned={showOnlyBanned}
                      onToggle={setShowOnlyBanned}
                      totalFriends={currentProfile.totalFriends}
                      bannedCount={currentProfile.bannedFriends.length}
                      themeConfig={themeConfig}
                    />
                  )}
                </div>

                {/* Friends Content */}
                {friendsToDisplay.length > 0 ? (
                  <>
                    {/* Search & Sort Controls */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 ">
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

                    {/* Search Results Count */}
                    {searchQuery && (
                      <p className="text-sm text-gray-400 mb-3">
                        Showing {filteredAndSortedFriends.length} of{" "}
                        {friendsToDisplay.length}{" "}
                        {showOnlyBanned ? "banned friends" : "friends"}
                      </p>
                    )}

                    {/* Friends List */}
                    <FriendsList
                      friends={filteredAndSortedFriends}
                      searchQuery={searchQuery}
                      themeConfig={themeConfig}
                    />
                  </>
                ) : (
                  currentProfile.totalFriends !== undefined && (
                    <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md">
                      <CardContent className="p-12 text-center">
                        <p className="text-gray-400 text-lg">
                          🎉 None of your friends have VAC or game bans!
                        </p>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
