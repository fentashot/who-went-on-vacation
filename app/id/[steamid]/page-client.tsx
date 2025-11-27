"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
import { LeetifyStats } from "@/components/profile/leetify-stats";
import {
  useSteamProfile,
  useFetchSteamProfile,
} from "@/hooks/use-steam-profile";
import { useTheme } from "@/contexts/theme-context";
import { type SortOrder } from "@/types/steam";
import { filterAndSortFriends } from "@/lib/utils";

interface PageClientProps {
  steamid: string;
}

export function PageClient({ steamid }: PageClientProps) {
  const router = useRouter();
  const { themeConfig, gridSize } = useTheme();
  const { data: currentProfile, isLoading, error } = useSteamProfile(steamid);
  const { mutateAsync: fetchProfile, isPending: isFetching } =
    useFetchSteamProfile();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [showOnlyBanned, setShowOnlyBanned] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSearch = async (profileUrl: string) => {
    try {
      await fetchProfile(profileUrl);
      router.push(`/id/${profileUrl}`);
    } catch {
      // Error handled by React Query
    }
  };

  const friendsToDisplay = useMemo(
    () =>
      showOnlyBanned
        ? (currentProfile?.bannedFriends ?? [])
        : (currentProfile?.allFriends ?? []),
    [showOnlyBanned, currentProfile]
  );

  const filteredAndSortedFriends = useMemo(
    () => filterAndSortFriends(friendsToDisplay, searchQuery, sortOrder),
    [friendsToDisplay, searchQuery, sortOrder]
  );

  const loading = isLoading || isFetching;

  return (
    <div className=" bg-black text-white relative" suppressHydrationWarning>
      <ThemeBackground
        mounted={mounted}
        themeConfig={themeConfig}
        gridSize={gridSize}
      />

      <div className="relative flex flex-col items-center py-10">
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <GridSizeSlider />
          <ViewToggle />
          <ThemeSelector />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl px-2 mt-8">
          {/* Search Bar */}
          <div className="mb-10 mx-auto space-y-10 max-w-3xl">
            <SteamSearchBar
              onSearch={handleSearch}
              loading={loading}
              error={error && !currentProfile ? error.message : null}
              themeConfig={themeConfig}
              showHeader={false}
              showExamples={false}
              placeholder={steamid}
            />
          </div>

          {/* Loading State */}
          {loading && !currentProfile && <LoadingSkeleton />}

          {/* Profile Results */}
          {currentProfile && (
            <div className="w-full space-y-14 mx-auto">
              <div className="max-w-6xl mx-auto">
                {currentProfile.userProfile?.steamid && (
                  <LeetifyStats
                    steamId={currentProfile.userProfile.steamid}
                    userProfile={currentProfile.userProfile}
                  />
                )}
              </div>

              {/* Friends Section */}
              {/* Section Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2 px-2">
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
              {currentProfile.totalFriends === 0 &&
              currentProfile.allFriends.length === 0 ? (
                // Private profile or no friends
                <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md">
                  <CardContent className="p-12 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
                      <svg
                        className="w-8 h-8 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                      Friends List Private
                    </h3>
                    <p className="text-gray-400">
                      This Steam profile has a private friends list or no
                      friends added yet.
                    </p>
                  </CardContent>
                </Card>
              ) : friendsToDisplay.length > 0 ? (
                <>
                  {/* Search & Sort Controls */}
                  <div className="mb-3 flex flex-row gap-1 ">
                    <FriendsSearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                    <div className="flex gap-1">
                      <SortButton
                        order="newest"
                        icon={ArrowUp}
                        currentSortOrder={sortOrder}
                        onSort={setSortOrder}
                        themeConfig={themeConfig}
                      />
                      <SortButton
                        order="oldest"
                        icon={ArrowDown}
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
                // Has friends but none match current filter (banned/all)
                <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md">
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-400 text-lg">
                      🎉 None of your friends have VAC or game bans!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
