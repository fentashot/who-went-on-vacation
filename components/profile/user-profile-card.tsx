"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, BarChart3 } from "lucide-react";
import Image from "next/image";
import { FriendProfile } from "@/types/steam";
import { SteamIcon } from "@/components/friends/banned-friend-card";

export function UserProfileCard({ profile }: { profile: FriendProfile }) {
  const csstatsUrl = `https://csstats.gg/player/${profile.steamid}`;

  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 pb-6 mb-6 border-b border-zinc-700/50">
      {/* Avatar & Basic Info */}
      <div className="flex items-start gap-2 ">
        <div className="relative">
          <Image
            src={profile.avatarfull}
            alt={profile.personaname}
            width={80}
            height={80}
            className="rounded-lg"
            unoptimized
          />
        </div>
        <div>
          <h3 className="text-xl hidden sm:block font-bold text-white mb-2 gap-2">
            {profile.personaname.length > 28
              ? profile.personaname.slice(0, 25) + "..."
              : profile.personaname}
          </h3>
          <h3 className="text-md sm:hidden font-bold text-white mb-2 gap-2 ">
            {profile.personaname.length > 20
              ? profile.personaname.slice(0, 17) + "..."
              : profile.personaname}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {profile.VACBanned && (
              <Badge
                variant="destructive"
                className="bg-red-900/50 text-red-200 border-red-800"
              >
                VAC BAN
              </Badge>
            )}
            {profile.NumberOfGameBans > 0 && (
              <Badge
                variant="destructive"
                className="bg-orange-900/50 text-orange-200 border-orange-800"
              >
                {profile.NumberOfGameBans} GAME BAN
                {profile.NumberOfGameBans > 1 ? "S" : ""}
              </Badge>
            )}
            {profile.CommunityBanned && (
              <Badge
                variant="destructive"
                className="bg-yellow-900/50 text-yellow-200 border-yellow-800"
              >
                COMM BAN
              </Badge>
            )}
            {profile.EconomyBan !== "none" && (
              <Badge
                variant="destructive"
                className="bg-purple-900/50 text-purple-200 border-purple-800"
              >
                TRADE BAN
              </Badge>
            )}
            {!profile.VACBanned &&
              profile.NumberOfGameBans === 0 &&
              !profile.CommunityBanned &&
              profile.EconomyBan === "none" && (
                <Badge
                  variant="outline"
                  className="bg-green-900/20 text-green-400 border-green-800"
                >
                  ✓ CLEAN
                </Badge>
              )}
          </div>
          {(profile.VACBanned || profile.NumberOfGameBans > 0) &&
            profile.DaysSinceLastBan > 0 && (
              <p className="text-xs text-gray-400">
                Last ban: {profile.DaysSinceLastBan} day
                {profile.DaysSinceLastBan !== 1 ? "s" : ""} ago
              </p>
            )}
        </div>
      </div>

      {/* Divider
          <div className="hidden md:block w-px bg-zinc-700/50" />

          {/* Links Section */}

      <div className="grid sm:grid-cols-2 gap-2">
        {/* Steam Profile */}
        <a
          href={profile.profileurl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 h-fit px-3 py-2 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-sm text-white w-fit"
        >
          <SteamIcon className="w-5 h-5" />
        </a>

        {/* CS Stats */}
        <a
          href={csstatsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 h-fit px-3 py-2 rounded-md bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-sm text-white w-fit"
        >
          <BarChart3 className="w-5 h-5" />
        </a>

        {/* FACEIT (disabled) - kept for future integration */}
      </div>
    </div>
  );
}
