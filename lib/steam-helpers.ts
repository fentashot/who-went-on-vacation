import { SteamPlayer, VACBanInfo } from "@/types/steam";
import { unstable_cache } from "next/cache";

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const CACHE_TTL = 3600; // 1 hour

interface SteamFriend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

export function extractSteamId(input: string): string | null {
  const cleanInput = input.trim();

  if (/^\d{17}$/.test(cleanInput)) {
    return cleanInput;
  }

  const patterns = [
    /steamcommunity\.com\/profiles\/(\d{17})/,
    /steamcommunity\.com\/id\/([^\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      return match[1];
    }
  }

  const vanityUrl = cleanInput.replace(/^[\.\/]+/, "");

  if (/^[a-zA-Z0-9_-]+$/.test(vanityUrl)) {
    return vanityUrl;
  }

  return null;
}

const getCachedVanityUrl = unstable_cache(
  async (vanityUrl: string) => {
    try {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`,
        { next: { revalidate: CACHE_TTL } }
      );

      if (!response.ok) {
        return null;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid Steam API response");
      }

      const data = await response.json();

      if (data.response?.success === 1) {
        return data.response.steamid;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },
  ["vanity-url"],
  {
    revalidate: CACHE_TTL,
    tags: ["steam-vanity"],
  }
);

export async function resolveVanityUrl(vanityUrl: string): Promise<string | null> {
  return getCachedVanityUrl(vanityUrl);
}

const getCachedFriendList = unstable_cache(
  async (steamId: string) => {
    try {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&relationship=friend`,
        { next: { revalidate: CACHE_TTL } }
      );

      if (!response.ok) {
        return [];
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid Steam API response");
      }

      const data = await response.json();
      return (
        data.friendslist?.friends?.map(
          (friend: SteamFriend) => friend.steamid
        ) || []
      );
    } catch {
      return [];
    }
  },
  ["friend-list"],
  {
    revalidate: CACHE_TTL,
    tags: ["steam-friends"],
  }
);

export async function getFriendList(steamId: string): Promise<string[]> {
  return getCachedFriendList(steamId);
}

const getCachedPlayerSummaries = unstable_cache(
  async (steamIds: string[]) => {
    try {
      const chunks = [];
      for (let i = 0; i < steamIds.length; i += 100) {
        chunks.push(steamIds.slice(i, i + 100));
      }

      const allPlayers: SteamPlayer[] = [];

      for (const chunk of chunks) {
        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${chunk.join(
            ","
          )}`,
          { next: { revalidate: CACHE_TTL } }
        );
        const data = await response.json();
        allPlayers.push(...(data.response?.players || []));
      }

      return allPlayers;
    } catch {
      return [];
    }
  },
  ["player-summaries"],
  {
    revalidate: CACHE_TTL,
    tags: ["steam-players"],
  }
);

export async function getPlayerSummaries(steamIds: string[]): Promise<SteamPlayer[]> {
  return getCachedPlayerSummaries(steamIds);
}

const getCachedVACBanStatus = unstable_cache(
  async (steamIds: string[]) => {
    try {
      const chunks = [];
      for (let i = 0; i < steamIds.length; i += 100) {
        chunks.push(steamIds.slice(i, i + 100));
      }

      const allBanInfo: VACBanInfo[] = [];

      for (const chunk of chunks) {
        const response = await fetch(
          `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${STEAM_API_KEY}&steamids=${chunk.join(
            ","
          )}`,
          { next: { revalidate: CACHE_TTL } }
        );
        const data = await response.json();
        allBanInfo.push(...(data.players || []));
      }

      return allBanInfo;
    } catch {
      return [];
    }
  },
  ["vac-ban-status"],
  {
    revalidate: CACHE_TTL,
    tags: ["steam-bans"],
  }
);

export async function getVACBanStatus(steamIds: string[]): Promise<VACBanInfo[]> {
  return getCachedVACBanStatus(steamIds);
}
