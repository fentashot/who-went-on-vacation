"use client";

import { Card, CardContent } from "@/components/ui/card";
import { BannedFriendCard } from "@/components/friends/banned-friend-card";
import { type ThemeConfig } from "@/contexts/theme-context";
import { useTheme } from "@/contexts/theme-context";
import { FriendProfile } from "@/types/steam";

interface FriendsListProps {
  friends: FriendProfile[];
  searchQuery: string;
  themeConfig: ThemeConfig;
}

export function FriendsList({
  friends,
  searchQuery,
  themeConfig,
}: FriendsListProps) {
  const { compactView } = useTheme();

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

  if (compactView) {
    return (
      <div className="grid gap-1.5 max-h-[200px] md:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend) => (
          <BannedFriendCard
            key={friend.steamid}
            friend={friend}
            themeConfig={themeConfig}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 min-h-[200px] grid-cols-1 lg:grid-cols-2 ">
      {friends.map((friend) => (
        <div key={friend.steamid} >
          <BannedFriendCard friend={friend} themeConfig={themeConfig} />
        </div>
      ))}
    </div>
  );
}
