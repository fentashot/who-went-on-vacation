"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BannedFriendCard } from "@/components/friends/banned-friend-card";
import { type ThemeConfig } from "@/contexts/theme-context";

export interface BannedFriend {
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

interface FriendsListProps {
  friends: BannedFriend[];
  searchQuery: string;
  themeConfig: ThemeConfig;
}

export function FriendsList({
  friends,
  searchQuery,
  themeConfig,
}: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md min-h-[200px] flex items-center">
        <CardContent className="p-8 text-center w-full">
          <p className="text-gray-400">
            No friends found matching &quot;{searchQuery}&quot;
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:px-12 lg:px-2 gap-3 min-h-[200px] grid-cols-1 lg:grid-cols-2">
      {friends.map((friend, index) => (
        <div
          key={friend.steamid}
          className={
            friends.length % 2 !== 0 && index === friends.length - 1
              ? "lg:col-span-2"
              : ""
          }
        >
          <BannedFriendCard friend={friend} themeConfig={themeConfig} />
        </div>
      ))}
    </div>
  );
}
