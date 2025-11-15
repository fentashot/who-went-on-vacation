'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

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

interface BannedFriendCardProps {
  friend: BannedFriend;
}

export function BannedFriendCard({ friend }: BannedFriendCardProps) {
  return (
    <Card className="bg-zinc-900/60 border-zinc-800/50 hover:border-zinc-700 transition-colors backdrop-blur-md">
      <CardContent>
        <div className="flex items-start gap-4">
          <Image
            src={friend.avatarmedium}
            alt={friend.personaname}
            width={64}
            height={64}
            className="rounded-lg"
          />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-4 items-center">
              <div>
                <h3 className="text-xl font-bold text-white">{friend.personaname}</h3>
              </div>
              <div>
                <a
                  href={friend.profileurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-red-400 hover:text-red-300 inline-flex items-center gap-1 mt-1"
                >
                  View Profile
                  <Eye className="w-4 h-4" />
                </a>
              </div>

            </div>
            <div className="flex flex-wrap gap-2">
              {friend.VACBanned && (
                <Badge className="bg-red-600 hover:bg-red-700 text-white">VAC BANNED</Badge>
              )}
              {friend.NumberOfGameBans > 0 && (
                <Badge className="bg-orange-600 hover:bg-orange-700 text-white">GAME BAN</Badge>
              )}
              {friend.CommunityBanned && (
                <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">COMMUNITY BAN</Badge>
              )}
              {friend.EconomyBan !== 'none' && (
                <Badge className="bg-purple-600 hover:bg-purple-700 text-white">TRADE BAN</Badge>
              )}
            </div>

            {/* <div className="text-sm text-gray-400 space-y-1">
              {friend.VACBanned && (
                <p>{friend.NumberOfVACBans} VAC ban(s) • Last ban {friend.DaysSinceLastBan} days ago</p>
              )}
              {friend.NumberOfGameBans > 0 && (
                <p>{friend.NumberOfGameBans} game ban(s) • Last ban {friend.DaysSinceLastBan} days ago</p>
              )}
              {friend.EconomyBan !== 'none' && (
                <p>Economy ban: {friend.EconomyBan}</p>
              )}
            </div> */}
            <div className="text-sm text-gray-400 space-y-1">
              {friend.DaysSinceLastBan && (
                <p>Last ban {friend.DaysSinceLastBan} days ago</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
