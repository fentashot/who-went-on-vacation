"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { type ThemeConfig } from "@/contexts/theme-context";

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

const SteamIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
  </svg>
);

export function BannedFriendCard({
  friend,
  themeConfig,
  compact = false,
}: {
  friend: BannedFriend;
  themeConfig?: ThemeConfig;
  compact?: boolean;
}) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/id/${friend.steamid}`);
  };

  if (compact) {
    return (
      <div
        onClick={handleCardClick}
        className="group relative overflow-hidden rounded-lg border border-zinc-800/50 bg-zinc-900/30 backdrop-blur-md hover:bg-zinc-800/40 cursor-pointer transition-all duration-300 hover:border-zinc-700/50 p-3"
        style={
          {
            "--card-accent": themeConfig?.accent || "rgb(220, 38, 38)",
            "--card-text": themeConfig?.text || "rgb(239, 68, 68)",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2">
          <div className="relative shrink-0">
            <Image
              src={friend.avatar}
              alt={friend.personaname}
              width={40}
              height={40}
              className="rounded-md"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-white truncate group-hover:text-[--card-text] transition-colors">
              {friend.personaname.length > 16 ? friend.personaname.slice(0, 13) + "..." : friend.personaname}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {friend.VACBanned && (
              <Badge
                variant="destructive"
                className="bg-red-900/30 text-red-400 border-red-800/50 text-xs px-2 py-0"
              >
                VAC
              </Badge>
            )}
            {friend.NumberOfGameBans > 0 && (
              <Badge
                variant="destructive"
                className="bg-orange-900/30 text-orange-400 border-orange-800/50 text-xs px-2 py-0"
              >
                Game
              </Badge>
            )}
            {friend.DaysSinceLastBan > 0 && (
              <span className="text-xs text-gray-400">
                {friend.DaysSinceLastBan}d
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-zinc-900/30 border border-zinc-800/50 hover:border-zinc-700 transition-colors backdrop-blur cursor-pointer rounded-lg h-full"
    >
      <div className="flex items-start gap-4 p-4 pb-5 h-full">
        <Image
          src={friend.avatarmedium}
          alt={friend.personaname}
          width={64}
          height={64}
          className="rounded-lg shrink-0 mt-2"
        />
        <div className="flex-1 min-w-0 flex flex-col ">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-white truncate">
              {friend.personaname}
            </h3>
            <div className="flex gap-1 shrink-0">
              <a
                href={friend.profileurl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-500 hover:text-slate-400 inline-flex items-center transition-colors p-2 rounded-md hover:bg-zinc-800/50"
                title="Steam Profile"
              >
                <SteamIcon className="w-5 h-5" />
              </a>
              <a
                href={`https://csstats.gg/player/${friend.steamid}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center transition-colors p-2 rounded-md hover:bg-zinc-800/50"
                style={{ color: themeConfig?.text || "#c084fc" }}
                title="CS Stats"
              >
                <BarChart3 className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {friend.VACBanned && (
              <Badge className="bg-red-600 hover:bg-red-700 text-white">
                VAC
              </Badge>
            )}
            {friend.NumberOfGameBans > 0 && (
              <Badge className="bg-orange-600 hover:bg-orange-700 text-white">
                GAME BAN
              </Badge>
            )}
            {friend.CommunityBanned && (
              <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">
                COMMUNITY BAN
              </Badge>
            )}
            {friend.EconomyBan !== "none" && (
              <Badge className="bg-purple-600 hover:bg-purple-700 text-white">
                TRADE BAN
              </Badge>
            )}
            {!friend.VACBanned &&
              !friend.NumberOfGameBans &&
              !friend.CommunityBanned &&
              friend.EconomyBan === "none" && (
                <Badge
                  variant="outline"
                  className="bg-green-900/20 text-green-400 border-green-800"
                >
                  ✓ CLEAN
                </Badge>
              )}
          </div>
          {friend.DaysSinceLastBan > 0 && (
            <p className="text-sm text-gray-400 mt-2">
              Last ban {friend.DaysSinceLastBan} days ago
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
