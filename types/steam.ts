/** Base Steam player info from GetPlayerSummaries API */
export interface SteamPlayer {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}

/** VAC/Game ban info from GetPlayerBans API */
export interface VACBanInfo {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

/** Combined player + ban info for display */
export interface FriendProfile extends SteamPlayer {
  VACBanned: boolean;
  NumberOfVACBans: number;
  NumberOfGameBans: number;
  DaysSinceLastBan: number;
  CommunityBanned: boolean;
  EconomyBan: string;
}

/** API response for /api/v2/steam */
export interface ApiResponseSteam {
  message: string;
  totalFriends: number;
  allFriends: FriendProfile[];
  bannedFriends: FriendProfile[];
  userProfile: FriendProfile;
}

/** API error response */
export interface ApiErrorResponse {
  error: string;
}

export type SortOrder = "newest" | "oldest";
