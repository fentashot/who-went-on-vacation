"use client";

import { useMemo } from "react";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { UserProfileCard } from "@/components/profile/user-profile-card";
import { useLeetifyStats } from "@/hooks/use-leetify-stats";
import { FriendProfile } from "@/types/steam";
import Image from "next/image";

interface LeetifyStatsProps {
  steamId: string;
  userProfile?: FriendProfile;
}

export function LeetifyStats({ steamId, userProfile }: LeetifyStatsProps) {
  const { themeConfig } = useTheme();

  // Memoize the steamId to prevent unnecessary re-renders
  const memoizedSteamId = useMemo(() => steamId, [steamId]);

  const { data: stats, isLoading, error } = useLeetifyStats(memoizedSteamId);

  const leetifyUrl = `https://leetify.com/public/profile/${steamId}`;

  // Determine badge color based on FACEIT ELO ranges.
  // These ranges are approximate and map to visual tiers (higher = stronger).
  const faceitBadgeClass = useMemo(() => {
    const elo = Number(stats?.faceit_elo ?? 0);
    if (!elo || elo <= 0) return "bg-black/10 border-zinc-700/50 text-white";
    if (elo >= 2001) return "bg-black/10 border-red-500 text-red-300"; // top
    if (elo >= 1751) return "bg-black/10 border-orange-400 text-orange-300";
    if (elo >= 1531) return "bg-black/10 border-amber-400 text-amber-300";
    if (elo >= 1351) return "bg-black/10 border-yellow-400 text-yellow-300";
    if (elo >= 1201) return "bg-black/10 border-lime-400 text-lime-300";
    if (elo >= 1051) return "bg-black/10 border-emerald-500 text-emerald-300";
    if (elo >= 901) return "bg-black/10 border-sky-400 text-sky-300";
    if (elo >= 751) return "bg-black/10 border-cyan-400 text-cyan-300";
    if (elo >= 501) return "bg-black/10 border-blue-400 text-blue-300";
    return "bg-black/10 border-zinc-700/50 text-white";
  }, [stats?.faceit_elo]);

  // Determine badge color for Premier points (approximate brackets)
  const premierBadgeClass = useMemo(() => {
    const pts = Number(stats?.premier ?? 0);
    if (!pts || pts <= 0) return "bg-black/10 border-zinc-700/50 text-white";
    if (pts >= 30000) return "bg-black/10 border-amber-400 text-amber-300"; // 30k+
    if (pts >= 25000) return "bg-black/10 border-red-400 text-red-300"; // 25k-29,999
    if (pts >= 20000) return "bg-black/10 border-pink-500 text-pink-300"; // 20k-24,999
    if (pts >= 15000) return "bg-black/10 border-violet-500 text-violet-300"; // 15k-19,999
    if (pts >= 10000) return "bg-black/10 border-indigo-500 text-indigo-300"; // 10k-14,999
    if (pts >= 5000) return "bg-black/10 border-sky-400 text-sky-300"; // 5k-9,999
    return "bg-black/10 border-zinc-700/50 text-white"; // <5k
  }, [stats?.premier]);

  if (isLoading) {
    return (
      <div className=" gap-4">
        {/* <div className="grid">
          {userProfile && <UserProfileCard profile={userProfile} />}
        </div> */}
        <div className="p-5 sm:p-10 max-w-3xl h-116 mx-auto xl:col-span-3 bg-zinc-900/30 border-zinc-800/50 border hover:border-zinc-700/70 transition backdrop-blur-md overflow-hidden rounded-2xl">
          <UserProfileCard profile={userProfile!} />
          <CardContent className="flex justify-center items-center flex-col text-center mt-[12vh]">
            <LoaderCircle className="animate-spin w-12 h-12 text-zinc-600/20 mb-4" />
          </CardContent>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className=" gap-4">
        {/* <div className="grid">
          {userProfile && <UserProfileCard profile={userProfile} />}
        </div> */}
        <div className="p-5 sm:p-10 max-w-3xl mx-auto xl:col-span-3 bg-zinc-900/30 border-zinc-800/50 border hover:border-zinc-700/70 transition backdrop-blur-md overflow-hidden rounded-2xl">
          <UserProfileCard profile={userProfile!} />
          <CardContent className="flex justify-center items-center flex-col text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-2 " />
            <h3 className="text-lg font-semibold text-red-400 mb-1">
              Leetify Stats Unavailable
            </h3>
            <p className="text-gray-400">
              {error?.message || "Failed to load Leetify stats"}
            </p>{" "}
          </CardContent>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl duration-500 mx-auto xl:col-span-3 bg-zinc-900/30 border-zinc-800/50 border hover:border-zinc-700/70 backdrop-blur-md overflow-hidden rounded-2xl ">
      <CardContent className="p-5 sm:p-10">
        <UserProfileCard profile={userProfile!} />
        <div className="flex sm:items-start justify-between">
          <div className="flex gap-2">
            <h3 className="text-2xl font-bold text-white">Stats</h3>
          </div>
          <div>
            <a
              href={leetifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: themeConfig?.text }}
              className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Image
                src="/Leetify.png"
                alt="Leetify Logo"
                width={100}
                height={40}
              />
            </a>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <Badge variant="outline" className={`${faceitBadgeClass} sm:text-sm`}>
            FACEIT: {stats.faceit_elo}
          </Badge>
          <Badge
            variant="outline"
            className={`${premierBadgeClass} sm:text-sm`}
          >
            Premier: {stats.premier}
          </Badge>
          {/* <Badge
              variant="outline"
              className="bg-black/10 border-zinc-700/50 text-white text-sm"
            >
              Competitive: {stats.competitive}
            </Badge> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-end">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <span
                  className="text-xl font-bold"
                  style={{ color: themeConfig.accent }}
                >
                  {stats.rating}
                </span>
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
                    <span className="text-sm text-gray-300">{skill.name}</span>
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
              {stats.kd !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">K/D</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.kd}
                  </p>
                </div>
              )}
              {stats.killsPerRound !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">K/R</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.killsPerRound}
                  </p>
                </div>
              )}
              <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                <p className="text-xs text-gray-400 mb-1">Winrate</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.winrate}%
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {stats.headAccuracy !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">HS%</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.headAccuracy}%
                  </p>
                </div>
              )}

              {stats.spottedAccuracy !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">Spotted Acc</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.spottedAccuracy}%
                  </p>
                </div>
              )}
              {stats.sprayAccuracy !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">Spray Acc</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.sprayAccuracy}%
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                <p className="text-xs text-gray-400 mb-1">TTD</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.timeToDamage}
                </p>
              </div>
              {stats.damagePerRound !== 0 && (
                <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                  <p className="text-xs text-gray-400 mb-1">DPR</p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    {stats.damagePerRound}
                  </p>
                </div>
              )}

              
              <div className="bg-zinc-800/50 rounded-lg p-2 px-3">
                <p className="text-xs text-gray-400 mb-1">Preaim</p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {stats.preaim}
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
  );
}
