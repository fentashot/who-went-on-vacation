'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { BannedFriendCard } from '@/components/banned-friend-card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ThemeSelector, type Theme, getThemeConfig, getStoredTheme } from '@/components/theme-selector';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import { SteamSearchBar } from '@/components/steam-search-bar';
import { FriendsFilterToggle } from '@/components/friends-filter-toggle';

interface BannedFriend {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  VACBanned: boolean;
  NumberOfVACBans: number;
  NumberOfGameBans: number;
  DaysSinceLastBan: number;
  CommunityBanned: boolean;
  EconomyBan: string;
}

interface ApiResponse {
  message: string;
  totalFriends?: number;
  allFriends: BannedFriend[];
  bannedFriends: BannedFriend[];
  userProfile?: BannedFriend;
}

// Cache outside component to persist across navigations
const profileCache = new Map<string, ApiResponse>();

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const steamid = params.steamid as string;

  // State
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [showOnlyBanned, setShowOnlyBanned] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<Theme>('white');
  const [mounted, setMounted] = useState(false);
  const [gridSize, setGridSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gridSize');
      return saved ? Number(saved) : 18;
    }
    return 18;
  });

  // Initialize theme and mount animation
  useEffect(() => {
    setCurrentTheme(getStoredTheme());
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Fetch profile on steamid change
  useEffect(() => {
    if (steamid) {
      fetchProfile(steamid);
    }
  }, [steamid]);

  const fetchProfile = async (profileId: string) => {
    const cacheKey = profileId.trim().toLowerCase();

    // Check cache first
    if (profileCache.has(cacheKey)) {
      setResult(profileCache.get(cacheKey)!);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/steam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl: profileId }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        profileCache.set(cacheKey, data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (profileUrl: string) => {
    router.push(`/id/${profileUrl}`);
  };

  const handleGridSizeChange = (newSize: number) => {
    setGridSize(newSize);
    localStorage.setItem('gridSize', String(newSize));
  };

  const themeConfig = getThemeConfig(currentTheme);

  const filteredAndSortedFriends = useMemo(() => {
    if (!result) return [];

    const friendsToShow = showOnlyBanned ? result.bannedFriends : result.allFriends;
    if (!friendsToShow) return [];

    return friendsToShow
      .filter(f => !searchQuery.trim() || f.personaname.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const aDays = a.DaysSinceLastBan || 0;
        const bDays = b.DaysSinceLastBan || 0;
        return sortOrder === 'newest' ? aDays - bDays : bDays - aDays;
      });
  }, [result, showOnlyBanned, searchQuery, sortOrder]);

  const SortButton = ({
    order,
    icon: Icon,
    label
  }: {
    order: 'newest' | 'oldest';
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  }) => {
    const isActive = sortOrder === order;

    return (
      <Button
        onClick={() => setSortOrder(order)}
        variant="outline"
        className={`h-10 rounded-lg transition-all duration-500 ${isActive
          ? 'text-white hover:text-gray-200'
          : 'bg-zinc-900/30 border-zinc-700/50 text-white hover:text-gray-200 hover:bg-zinc-800/40'
          }`}
        style={isActive ? {
          backgroundColor: themeConfig.accent,
          borderColor: themeConfig.accent
        } : undefined}
        onMouseEnter={(e) => isActive && (e.currentTarget.style.backgroundColor = themeConfig.accentHover)}
        onMouseLeave={(e) => isActive && (e.currentTarget.style.backgroundColor = themeConfig.accent)}
      >
        <Icon className="min-w-5 min-h-5" />
        {label}
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative" style={{
      '--theme-gradient-from': themeConfig.gradient.from,
      '--theme-gradient-via': themeConfig.gradient.via,
      '--theme-gradient-to': themeConfig.gradient.to,
      '--theme-grid-color': themeConfig.gridColor,
    } as React.CSSProperties}>

      <div className="fixed inset-0 bg-black pointer-events-none">
        <div
          className={`absolute inset-0 background-grid transition-opacity duration-800 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundSize: `${gridSize}px ${gridSize}px` }}
        />
        <div className={`absolute inset-0 background-gradient transition-opacity duration-800 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative min-h-screen flex flex-col items-center py-10">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-3">
          <Button className="flex items-center gap-2 bg-black backdrop-blur-md border border-zinc-700/50 rounded-lg px-3 py-2 focus:bg-black hover:bg-black">
            <span className="text-sm">Size</span>
            <input
              type="range"
              min="15"
              max="30"
              value={gridSize}
              onChange={(e) => handleGridSizeChange(Number(e.target.value))}
              className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-0"
            />
            <span className="text-sm text-white font-medium w-6">{gridSize}</span>
          </Button>

          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>

        <div className="w-full max-w-6xl px-4 mt-8">
          <div className="mb-8">
            <SteamSearchBar
              onSearch={handleSearch}
              loading={loading}
              themeConfig={themeConfig}
              showHeader={false}
              showExamples={false}
            />
          </div>

          {error && (
            <div className="w-full max-w-3xl mb-6 mx-auto">
              <div className="border rounded-2xl p-4 backdrop-blur-md transition-all duration-500" style={{ backgroundColor: `${themeConfig.accent}15`, borderColor: `${themeConfig.accent}80` }}>
                <p className="text-center transition-colors duration-500" style={{ color: themeConfig.text }}>⚠️ {error}</p>
              </div>
            </div>
          )}

          {loading && !result && <LoadingSkeleton />}

          {result && (
            <div className="w-full space-y-14">
              {result.userProfile && (
                <div>
                  <UserProfileCard profile={result.userProfile} />
                </div>
              )}

              <div className="space-y-10 px-2">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">{result.message}</h2>
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

                {(showOnlyBanned ? result.bannedFriends.length > 0 : result.allFriends.length > 0) ? (
                  <>
                    <div className="mb-6 flex flex-col sm:flex-row gap-3 md:px-12 lg:px-2">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="flex-1 h-10 bg-zinc-900/30 border-zinc-700/50 text-white placeholder:text-gray-500 backdrop-blur-md rounded-lg"
                      />
                      <div className="flex gap-2">
                        <SortButton order="newest" icon={ArrowUp} label="Newest" />
                        <SortButton order="oldest" icon={ArrowDown} label="Oldest" />
                      </div>
                    </div>

                    {searchQuery && (
                      <p className="text-sm text-gray-400 mb-3">
                        Showing {filteredAndSortedFriends.length} of {showOnlyBanned ? result.bannedFriends.length : result.allFriends.length} {showOnlyBanned ? 'banned friends' : 'friends'}
                      </p>
                    )}

                    {filteredAndSortedFriends.length > 0 ? (
                      <div className="grid md:px-12 lg:px-2 gap-3 min-h-[200px] grid-cols-1 lg:grid-cols-2">
                        {filteredAndSortedFriends.map((friend, index) => (
                          <div
                            key={friend.steamid}
                            className={
                              filteredAndSortedFriends.length % 2 !== 0 &&
                                index === filteredAndSortedFriends.length - 1
                                ? 'lg:col-span-2'
                                : ''
                            }
                          >
                            <BannedFriendCard friend={friend} themeConfig={themeConfig} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md min-h-[200px] flex items-center">
                        <CardContent className="p-8 text-center w-full">
                          <p className="text-gray-400">No friends found matching &quot;{searchQuery}&quot;</p>
                        </CardContent>
                      </Card>
                    )}
                  </>
                ) : result.totalFriends !== undefined ? (
                  <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md">
                    <CardContent className="p-12 text-center">
                      <p className="text-gray-400 text-lg">🎉 None of your friends have VAC or game bans!</p>
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
