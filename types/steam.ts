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

export interface ApiResponse {
  message: string;
  totalFriends?: number;
  allFriends: BannedFriend[];
  bannedFriends: BannedFriend[];
  userProfile?: BannedFriend;
}

export type SortOrder = 'newest' | 'oldest';
