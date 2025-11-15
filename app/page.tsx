'use client';

import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Eye, Users, ArrowUp, ArrowDown, Loader2Icon } from 'lucide-react';
import { BannedFriendCard } from '@/components/banned-friend-card';
import { UserProfileCard } from '@/components/user-profile-card';
import { ThemeSelector, type Theme, getThemeConfig, getStoredTheme } from '@/components/theme-selector';
import { UpperBar } from '@/components/upper-bar';
import { LoadingSkeleton } from '@/components/loading-skeleton';

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
  userProfile?: BannedFriend;
  totalFriends?: number;
  bannedFriends: BannedFriend[];
  error?: string;
}

const BADGE_EXAMPLES = ['donkgojo', '76561198034202275', '../id/donkgojo', '../profiles/76561198034202275'];
const BADGE_CLASS = 'bg-zinc-900/20 text-gray-400 hover:bg-zinc-800/30 backdrop-blur-sm border border-zinc-700/30';

export default function Home() {
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [currentTheme, setCurrentTheme] = useState<Theme>('white');
  const [mounted, setMounted] = useState(false);
  const [firstSearch, setFirstSearch] = useState(false);

  useEffect(() => {
    setCurrentTheme(getStoredTheme());
    const timer = setTimeout(() => setMounted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const themeConfig = getThemeConfig(currentTheme);

  const filteredAndSortedFriends = useMemo(() => {
    if (!result?.bannedFriends) return [];
    return result.bannedFriends
      .filter(f => !searchQuery.trim() || f.personaname.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => sortOrder === 'newest' ? a.DaysSinceLastBan - b.DaysSinceLastBan : b.DaysSinceLastBan - a.DaysSinceLastBan);
  }, [result?.bannedFriends, searchQuery, sortOrder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    if (!firstSearch) setFirstSearch(true);

    try {
      const res = await fetch('/api/steam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
    console.log(firstSearch);
  };

  const SortButton = ({ order, icon: Icon, label }: { order: 'newest' | 'oldest'; icon: React.ComponentType<{ className?: string }>; label: string }) => {
    const isActive = sortOrder === order;
    return (
      <Button
        onClick={() => setSortOrder(order)}
        variant="outline"
        className={`h-10 rounded-lg transition-all duration-500 ${isActive ? 'text-white hover:text-gray-200' : 'bg-zinc-900/30 border-zinc-700/50 text-white hover:text-gray-200 hover:bg-zinc-800/40'}`}
        style={isActive ? { backgroundColor: themeConfig.accent, borderColor: themeConfig.accent } : undefined}
        onMouseEnter={(e) => isActive && (e.currentTarget.style.backgroundColor = themeConfig.accentHover)}
        onMouseLeave={(e) => isActive && (e.currentTarget.style.backgroundColor = themeConfig.accent)}
      >
        <Icon className="min-w-4 min-h-4" />
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
        <div className={`absolute inset-0 background-grid transition-opacity duration-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute inset-0 background-gradient transition-opacity duration-1200 ${mounted ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      <div className="relative min-h-screen flex flex-col items-center s">

        <div className="absolute top-4 right-4 z-10">
          <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
        </div>
        {/* <UpperBar /> */}
        <div className={`w-full flex flex-col items-center transition-all duration-700 ${firstSearch ? 'mt-[10vh]' : 'mt-[30vh] ]'}`}>
          <div className="text-center space-y-4 mb-12">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Eye className="w-10 h-10 transition-colors duration-700" style={{ color: themeConfig.text }} />
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                <span className="transition-colors duration-700" style={{ color: themeConfig.text }}>One search,</span>{' '}
                <span className="text-white">
                  all bans
                  <span className="inline-block w-8 text-left">
                    <span className={loading ? "animate-blink-dots" : "opacity-0"}>
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                </span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">Steam VAC Ban Checker</p>
          </div>

          <div className="w-full max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-14">
              <div className="flex">
                <input
                  type="text"
                  value={profileUrl}
                  onChange={(e) => setProfileUrl(e.target.value)}
                  placeholder="Enter Steam profile URL or ID..."
                  className="w-full border-r-0 h-14 bg-zinc-900/30 border-2 px-4 focus:ring-0 focus:outline-none border-zinc-700/50 text-white placeholder:text-gray-500 text-md backdrop-blur-md rounded-2xl rounded-e-none  transition-all duration-500"
                  disabled={loading}
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className={"h-14 text-white rounded-xl transition-all duration-500 rounded-l-none z-10 border-2 border-l-0"}
                  style={{ backgroundColor: themeConfig.accent, borderColor: themeConfig.border }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.accentHover}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeConfig.accent}
                >
                  {loading ? <Loader2Icon className="min-w-12 min-h-6 animate-spin" /> : <Search className="min-w-12 min-h-6" />}
                </Button>
              </div>

              <div className={"text-center " + (loading && 'hidden') + (result ? ' hidden' : '')}>
                <p className="text-xs text-gray-500 mb-3 mt-6">Supported formats</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {BADGE_EXAMPLES.map(text => (
                    <Badge key={text} variant="secondary" className={BADGE_CLASS}>{text}</Badge>
                  ))}
                </div>
              </div>
            </form>
          </div>

          {error && (
            <div className="w-full max-w-3xl mb-6">
              <div className="border rounded-2xl p-4 backdrop-blur-md transition-all duration-500" style={{ backgroundColor: `${themeConfig.accent}15`, borderColor: `${themeConfig.accent}80` }}>
                <p className="text-center transition-colors duration-500" style={{ color: themeConfig.text }}>⚠️ {error}</p>
              </div>
            </div>
          )}

          {/* {!loading && result && <LoadingSkeleton />} */}
          {loading && !result && <LoadingSkeleton />}

          {result && (
            <div className="w-full max-w-6xl space-y-14">
              {result.userProfile && (
                <div>
                  <UserProfileCard profile={result.userProfile} />
                </div>
              )}

              <div className="space-y-10 px-2">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-4">{result.message}</h2>
                  {result.totalFriends !== undefined && (
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <Badge variant="outline" className="bg-black/10 border-zinc-700/50 text-white px-4 py-2 backdrop-blur w-52 text-sm">
                        <Users className="min-w-4 min-h-4 mr-1 text-zinc-400" />
                        Total friends: <span className="font-bold ml-1">{result.totalFriends}</span>
                      </Badge>
                      <Badge variant="outline" className="bg-black/10 text-white px-4 py-2 backdrop-blur-sm w-52 text-sm transition-all duration-500" style={{ borderColor: `${themeConfig.accent}80` }}>
                        <Eye className="min-w-4 min-h-4 mr-1 transition-colors duration-500" style={{ color: themeConfig.text }} />
                        With bans: <span className="font-bold ml-1 transition-colors duration-500" style={{ color: themeConfig.text }}>{result.bannedFriends.length}</span>
                      </Badge>
                    </div>
                  )}
                </div>

                {result.bannedFriends.length > 0 ? (
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
                        Showing {filteredAndSortedFriends.length} of {result.bannedFriends.length} banned friends
                      </p>
                    )}

                    {filteredAndSortedFriends.length > 0 ? (
                      <div className="grid md:px-12 lg:px-2 grid-cols-1 lg:grid-cols-2 gap-3 min-h-[200px]">
                        {filteredAndSortedFriends.map((friend) => (
                          <div key={friend.steamid}>
                            <BannedFriendCard friend={friend} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md min-h-[200px] flex items-center">
                        <CardContent className="p-8 text-center w-full">
                          <p className="text-gray-400">No banned friends found matching &quot;{searchQuery}&quot;</p>
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
