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

export function BannedFriendCard({ friend }: { friend: BannedFriend }) {
  return (
    <Card className="bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 transition-colors backdrop-blur">
      <CardContent>
        <div className="flex items-start gap-4">
          <Image src={friend.avatarmedium} alt={friend.personaname} width={64} height={64} className="rounded-lg" />
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-white">{friend.personaname}</h3>
              <a
                href={friend.profileurl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-red-400 hover:text-red-300 inline-flex items-center gap-1"
              >
                Profile
                <Eye className="w-4 h-4" />
              </a>
            </div>
            <div className="flex flex-wrap gap-2">
              {friend.VACBanned && <Badge className="bg-red-600 hover:bg-red-700 text-white">VAC BANNED</Badge>}
              {friend.NumberOfGameBans > 0 && <Badge className="bg-orange-600 hover:bg-orange-700 text-white">GAME BAN</Badge>}
              {friend.CommunityBanned && <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">COMMUNITY BAN</Badge>}
              {friend.EconomyBan !== 'none' && <Badge className="bg-purple-600 hover:bg-purple-700 text-white">TRADE BAN</Badge>}
            </div>
            {friend.DaysSinceLastBan && (
              <p className="text-sm text-gray-400">Last ban {friend.DaysSinceLastBan} days ago</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
