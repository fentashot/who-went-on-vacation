// Types for CSWatch player data (mapped)
export interface CswatchStats {
  steamid: string;
  nickname?: string;
  totalMatches?: number | null;
  wins?: number | null;
  losses?: number | null;
  winrate?: number | null; // percentage 0-100
  kd?: number | null; // kills/deaths
  kdr?: number | null; // alternate naming
  hs?: number | null; // headshot percentage
  rating?: number | null; // any rating value provided
  lastSeen?: string | null;
  raw?: unknown; // raw API response for fields we don't map explicitly
}

export interface CswatchApiResponse {
  stats: CswatchStats | null;
  message?: string;
}
