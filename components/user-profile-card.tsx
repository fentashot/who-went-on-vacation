'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, BarChart3, Trophy } from 'lucide-react';
import Image from 'next/image';

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

interface UserProfileCardProps {
  profile: UserProfile;
}

export function UserProfileCard({ profile }: UserProfileCardProps) {
  const csstatsUrl = `https://csstats.gg/player/${profile.steamid}`;
  const faceitUrl = `https://www.faceit.com/en/search/player/${profile.personaname}`;

  return (
    <Card className="bg-zinc-900/60 border-zinc-800/50 backdrop-blur-md overflow-hidden max-w-fit mx-auto">
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4">
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
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{profile.personaname}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.VACBanned && (
                  <Badge variant="destructive" className="bg-red-900/50 text-red-200 border-red-800">
                    VAC BAN
                  </Badge>
                )}
                {profile.NumberOfGameBans > 0 && (
                  <Badge variant="destructive" className="bg-orange-900/50 text-orange-200 border-orange-800">
                    {profile.NumberOfGameBans} GAME BAN{profile.NumberOfGameBans > 1 ? 'S' : ''}
                  </Badge>
                )}
                {profile.CommunityBanned && (
                  <Badge variant="destructive" className="bg-yellow-900/50 text-yellow-200 border-yellow-800">
                    COMM BAN
                  </Badge>
                )}
                {profile.EconomyBan !== 'none' && (
                  <Badge variant="destructive" className="bg-purple-900/50 text-purple-200 border-purple-800">
                    TRADE BAN
                  </Badge>
                )}
                {!profile.VACBanned && profile.NumberOfGameBans === 0 && !profile.CommunityBanned && profile.EconomyBan === 'none' && (
                  <Badge variant="outline" className="bg-green-900/20 text-green-400 border-green-800">
                    ✓ CLEAN
                  </Badge>
                )}
              </div>
              {(profile.VACBanned || profile.NumberOfGameBans > 0) && profile.DaysSinceLastBan > 0 && (
                <p className="text-xs text-gray-400">
                  Last ban: {profile.DaysSinceLastBan} day{profile.DaysSinceLastBan !== 1 ? 's' : ''} ago
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-zinc-700/50" />

          {/* Links Section */}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-400 mb-3">Quick Links</h4>
            <div className="grid grid-cols-1 gap-2">
              {/* Steam Profile */}
              <a
                href={profile.profileurl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-sm text-white"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Steam Profile</span>
              </a>

              {/* CS Stats */}
              <a
                href={csstatsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-sm text-white"
              >
                <BarChart3 className="w-4 h-4 text-orange-400" />
                <span>CS Stats</span>
              </a>

              {/* FACEIT
              <a
                href={faceitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors text-sm text-white"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>FACEIT</span>
              </a> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
