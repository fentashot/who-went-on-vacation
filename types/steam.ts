export interface FriendProfile {
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
  allFriends: FriendProfile[];
  bannedFriends: FriendProfile[];
  userProfile?: FriendProfile;
}

export type SortOrder = 'newest' | 'oldest';
