'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { BannedFriendCard } from '@/components/banned-friend-card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ThemeSelector, type Theme, getThemeConfig, getStoredTheme } from '@/components/theme-selector';

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

interface UserProfile {
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
  userProfile?: UserProfile;
  totalFriends?: number;
  bannedFriends: BannedFriend[];
  error?: string;
}

export default function Home() {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentTheme, setCurrentTheme] = useState<Theme>('white');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    // Trigger fade-in animation after a brief delay
    const timer = setTimeout(() => {
      setMounted(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = getThemeConfig(currentTheme);

  // Filter and sort banned friends
  const filteredAndSortedFriends = useMemo(() => {
    if (!result?.bannedFriends) return [];

    let friends = [...result.bannedFriends];

    // Filter by search query
    if (searchQuery.trim()) {
      friends = friends.filter(friend =>
        friend.personaname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by ban date
    friends.sort((a, b) => {
      if (sortOrder === 'newest') {
        return a.DaysSinceLastBan - b.DaysSinceLastBan;
      } else {
        return b.DaysSinceLastBan - a.DaysSinceLastBan;
      }
    });

    return friends;
  }, [result?.bannedFriends, searchQuery, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/steam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'An error occurred');
      } else {
        setResult(data);
      }
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-black text-white relative"
      style={{
        '--theme-gradient-from': themeConfig.gradient.from,
        '--theme-gradient-via': themeConfig.gradient.via,
        '--theme-gradient-to': themeConfig.gradient.to,
        '--theme-grid-color': themeConfig.gridColor,
      } as React.CSSProperties}
    >
      {/* Combined gradient and grid - grid fades with the gradient */}
      <div className="fixed inset-0 bg-black pointer-events-none">
        {/* Grid pattern that fades with radial gradient mask */}
        <div
          className={`absolute inset-0 background-grid ${mounted ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Dynamic colored glow in center - rectangular shape */}
        <div
          className={`absolute inset-0 background-gradient ${mounted ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>

      <div className="relative min-h-screen flex flex-col items-center px-4 py-20">
        {/* Theme Selector */}
        <div className="absolute top-4 right-4 z-10">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>

        {/* Main Heading */}
        <div className="text-center space-y-4 mb-12 mt-20">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Eye className="w-10 h-10 transition-colors duration-700" style={{ color: themeConfig.text }} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="transition-colors duration-700" style={{ color: themeConfig.text }}>One search,</span>{' '}
              <span className="text-white">all vacs.</span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Steam VAC Ban Checker
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-3xl mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="Enter Steam profile URL or ID..."
                className="w-full h-16 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-gray-500 pr-36 text-lg backdrop-blur-md rounded-2xl transition-all duration-500"
                style={{
                  '--tw-ring-color': themeConfig.ring
                } as React.CSSProperties}
                disabled={loading}
                required
              />
              <Button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 h-12 text-white rounded-xl px-6 transition-all duration-500"
                style={{
                  backgroundColor: themeConfig.accent,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.accentHover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeConfig.accent}
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {/* Supported formats */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-3">Supported formats</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-zinc-900/40 text-gray-400 hover:bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/30">
                  donkgojo
                </Badge>
                <Badge variant="secondary" className="bg-zinc-900/40 text-gray-400 hover:bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/30">
                  76561198034202275
                </Badge>
                <Badge variant="secondary" className="bg-zinc-900/40 text-gray-400 hover:bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/30">
                  ../id/donkgojo
                </Badge>
                <Badge variant="secondary" className="bg-zinc-900/40 text-gray-400 hover:bg-zinc-800/60 backdrop-blur-sm border border-zinc-700/30">
                  ../profiles/76561198034202275
                </Badge>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full max-w-3xl mb-6">
            <div
              className="border rounded-2xl p-4 backdrop-blur-md transition-all duration-500"
              style={{
                backgroundColor: `${themeConfig.accent}15`,
                borderColor: `${themeConfig.accent}80`,
              }}
            >
              <p className="text-center transition-colors duration-500" style={{ color: themeConfig.text }}>⚠️ {error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="w-full max-w-6xl mt-8 space-y-6">
            {/* User Profile Card */}
            {result.userProfile && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UserProfileCard profile={result.userProfile} />
              </div>
            )}

            {/* Leetify Stats */}
            {/* {result.userProfile && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '50ms' }}>
                <LeetifyStats steamId={result.userProfile.steamid} />
              </div>
            )} */}

            {/* Stats and Banned Friends */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
              <div className="my-10 text-center">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white">{result.message}</h2>
                </div>
                {result.totalFriends !== undefined && (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    <Badge variant="outline" className="bg-black/30 border-zinc-700/50 text-white px-4 py-2 backdrop-blur-sm w-52">
                      <Users className="w-4 h-4 mr-2 text-zinc-400" />
                      <span className="text-sm">Total friends: <span className="font-bold ml-1">{result.totalFriends}</span></span>
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-black/30 text-white px-4 py-2 backdrop-blur-sm w-52 transition-all duration-500"
                      style={{
                        borderColor: `${themeConfig.accent}80`,
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2 transition-colors duration-500" style={{ color: themeConfig.text }} />
                      <span className="text-sm">With bans: <span className="font-bold ml-1 transition-colors duration-500" style={{ color: themeConfig.text }}>{result.bannedFriends.length}</span></span>
                    </Badge>
                  </div>
                )}
              </div>

              {result.bannedFriends.length > 0 ? (
                <>
                  {/* Filter and Sort Controls */}
                  <div className="mb-6 flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="flex-1">
                      <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full h-10 bg-zinc-900/60 border-zinc-700/50 text-white placeholder:text-gray-500 text-sm focus-visible:ring-red-500 backdrop-blur-md rounded-lg"
                      />
                    </div>

                    {/* Sort Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSortOrder('newest')}
                        variant="outline"
                        className={`h-10 rounded-lg transition-all duration-500 ${sortOrder === 'newest'
                          ? 'text-white border-opacity-100'
                          : 'bg-zinc-900/60 border-zinc-700/50 text-white hover:bg-zinc-800/60 hover:text-white hover:border-zinc-600'
                          }`}
                        style={sortOrder === 'newest' ? {
                          backgroundColor: themeConfig.accent,
                          borderColor: themeConfig.accent,
                        } : undefined}
                        onMouseEnter={(e) => {
                          if (sortOrder === 'newest') {
                            e.currentTarget.style.backgroundColor = themeConfig.accentHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortOrder === 'newest') {
                            e.currentTarget.style.backgroundColor = themeConfig.accent;
                          }
                        }}
                      >
                        <ArrowUp className="w-4 h-4 mr-2" />
                        Newest
                      </Button>
                      <Button
                        onClick={() => setSortOrder('oldest')}
                        variant="outline"
                        className={`h-10 rounded-lg transition-all duration-500 ${sortOrder === 'oldest'
                          ? 'text-white border-opacity-100'
                          : 'bg-zinc-900/60 border-zinc-700/50 text-white hover:bg-zinc-800/60 hover:text-white hover:border-zinc-600'
                          }`}
                        style={sortOrder === 'oldest' ? {
                          backgroundColor: themeConfig.accent,
                          borderColor: themeConfig.accent,
                        } : undefined}
                        onMouseEnter={(e) => {
                          if (sortOrder === 'oldest') {
                            e.currentTarget.style.backgroundColor = themeConfig.accentHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (sortOrder === 'oldest') {
                            e.currentTarget.style.backgroundColor = themeConfig.accent;
                          }
                        }}
                      >
                        <ArrowDown className="w-4 h-4 mr-2" />
                        Oldest
                      </Button>
                    </div>
                  </div>

                  {/* Results count */}
                  {searchQuery && (
                    <p className="text-sm text-gray-400 mb-3">
                      Showing {filteredAndSortedFriends.length} of {result.bannedFriends.length} banned friends
                    </p>
                  )}

                  {/* Banned Friends Grid */}
                  {filteredAndSortedFriends.length > 0 ? (
                    <div className={'grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[200px]'}>
                      {filteredAndSortedFriends.map((friend, index) => (
                        <div
                          key={friend.steamid}
                          className="animate-in fade-in slide-in-from-bottom-2"
                          style={{
                            animationDelay: `${index * 50}ms`,
                            animationDuration: '400ms',
                            animationFillMode: 'backwards'
                          }}
                        >
                          <BannedFriendCard friend={friend} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-zinc-900/60 border-zinc-800/50 backdrop-blur-md min-h-[200px] flex items-center">
                      <CardContent className="p-8 text-center w-full">
                        <p className="text-gray-400">
                          No banned friends found matching &quot;{searchQuery}&quot;
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : result.totalFriends !== undefined ? (
                <Card className="bg-zinc-900/60 border-zinc-800/50 backdrop-blur-md">
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
  );
}
