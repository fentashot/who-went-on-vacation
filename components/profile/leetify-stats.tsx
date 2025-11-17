"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import type { LeetifyDisplayStats } from "@/types/leetify";
import { useTheme } from "@/contexts/theme-context";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileCard } from "@/components/profile/user-profile-card";
import { useProfile } from "@/contexts/profile-context";

export function LeetifyStats() {
  const [stats, setStats] = useState<LeetifyDisplayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { themeConfig } = useTheme();

  const { currentProfile } = useProfile();

  const steamid = currentProfile?.userProfile?.steamid;

  useEffect(() => {
    const fetchLeetifyStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/leetify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steamId: steamid }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch Leetify stats");
        } else {
          setStats(data.stats);
          console.log(data);
        }
      } catch {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLeetifyStats();
  }, [steamid]);

  const leetifyUrl = `https://leetify.com/public/profile/${steamid}`;

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="grid">
          {currentProfile?.userProfile && (
            <UserProfileCard profile={currentProfile.userProfile} />
          )}
        </div>
        <Skeleton className="col-span-2 bg-zinc-900/40 border-zinc-800/50 backdrop-blur-md overflow-hidden min-w-full h-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="grid">
          {currentProfile?.userProfile && (
            <UserProfileCard profile={currentProfile.userProfile} />
          )}
        </div>
        <Card className="col-span-2 bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden max-w-5xl">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
            <p className="text-gray-400 mb-2">{error}</p>
            <a
              href={leetifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: themeConfig?.text }}
              className={
                "text-sm transition-colors" +
                (themeConfig
                  ? ` text-[${themeConfig.accent}] hover:text-[${themeConfig.accent}]`
                  : "text-pink-400 hover:text-pink-300")
              }
            >
              View Leetify Profile →
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="grid">
        {currentProfile?.userProfile && (
          <UserProfileCard profile={currentProfile.userProfile} />
        )}
      </div>
      <div className="col-span-2 bg-zinc-900/30 border-zinc-800/50 border-1 hover:border-zinc-700/70 transition backdrop-blur-md overflow-hidden rounded-lg ">
        <CardContent className="pt-8 pb-12 px-8">
          <div className="flex items-center sm:items-start justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Leetify Statistics
                </h3>
              </div>
            </div>
            <a
              href={leetifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: themeConfig?.text }}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              View Full Profile →
            </a>
          </div>

          <div className="flex gap-2 mb-4">
            <Badge
              variant="outline"
              className="bg-black/10 border-zinc-700/50 text-white text-sm"
            >
              FACEIT: {stats.faceit}
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/10 border-zinc-700/50 text-white text-sm"
            >
              Premier: {stats.premier}
            </Badge>
            <Badge
              variant="outline"
              className="bg-black/10 border-zinc-700/50 text-white text-sm"
            >
              Competitive: {stats.competitive}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                    <span className="text-xl font-bold text-emerald-400">
                      {stats.rating}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Leetify Rating</p>
                  <p className="text-base text-white font-semibold">
                    {stats.matches} total matches
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {stats.skills.slice(0, 3).map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-300">
                        {skill.name}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {skill.value}
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                        style={{ width: `${skill.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">K/D</p>
                  <p className="text-2xl font-bold text-white">{stats.kd}</p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">K/R</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.killsPerRound}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Winrate</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.winrate}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">HS%</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.headAccuracy}%
                  </p>
                </div>

                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Spotted Acc</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.spottedAccuracy}%
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Spray Acc</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.sprayAccuracy}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">TTD</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.timeToDamage}
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">DPR</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.damagePerRound}
                  </p>
                </div>
              </div>

              {stats.winHistory.length > 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-2">Recent W/L</p>
                  <div className="flex gap-1">
                    {stats.winHistory.map((result, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${result === "W"
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                          }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
}
