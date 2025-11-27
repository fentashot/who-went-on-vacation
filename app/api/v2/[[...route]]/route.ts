import { Hono } from "hono";
import { handle } from "hono/vercel";
import {
  extractSteamId,
  resolveVanityUrl,
  getFriendList,
  getPlayerSummaries,
  getVACBanStatus,
} from "@/lib/steam-helpers";
import {
  isValidSteam64Id,
  getCachedLeetifyMatches,
  calculateMatchStats,
  getCachedLeetifyProfile,
  transformLeetifyData,
} from "@/lib/leetify-helpers";
import type { FriendProfile, ApiResponseSteam } from "@/types/steam";
import type { LeetifyApiResponse } from "@/types/leetify";

const STEAM_API_KEY = process.env.STEAM_API_KEY;

const app = new Hono().basePath("/api/v2/");

app.get("/hello", (c) => {
  return c.json({ message: "Hello from Hono 🔥" });
});

interface SteamRequestBody {
  profileUrl?: string;
}

interface LeetifyRequestBody {
  steamId?: string;
}

// @POST /api/v2/steam
app.post("/steam", async (c) => {
  try {
    if (!STEAM_API_KEY || STEAM_API_KEY === "your_steam_api_key_here") {
      return c.json(
        { error: "Steam API key not configured. Please add STEAM_API_KEY to your .env file." },
        500
      );
    }

    const body = await c.req.json<SteamRequestBody>();
    const { profileUrl } = body;

    if (!profileUrl) {
      return c.json({ error: "Profile URL is required" }, 400);
    }

    let steamId = extractSteamId(profileUrl);
    if (steamId && !/^\d{17}$/.test(steamId)) {
      steamId = await resolveVanityUrl(steamId);
    }

    if (!steamId) {
      return c.json({ error: "Invalid Steam profile URL" }, 400);
    }

    const [userProfiles, userBanStatuses] = await Promise.all([
      getPlayerSummaries([steamId]),
      getVACBanStatus([steamId]),
    ]);

    const userProfile: FriendProfile = {
      ...userProfiles[0],
      VACBanned: userBanStatuses[0]?.VACBanned ?? false,
      NumberOfVACBans: userBanStatuses[0]?.NumberOfVACBans ?? 0,
      NumberOfGameBans: userBanStatuses[0]?.NumberOfGameBans ?? 0,
      DaysSinceLastBan: userBanStatuses[0]?.DaysSinceLastBan ?? 0,
      CommunityBanned: userBanStatuses[0]?.CommunityBanned ?? false,
      EconomyBan: userBanStatuses[0]?.EconomyBan ?? "none",
    };

    const friendIds = await getFriendList(steamId);

    if (friendIds.length === 0) {
      const response: ApiResponseSteam = {
        message: "No friends found or profile is private",
        userProfile,
        totalFriends: 0,
        allFriends: [],
        bannedFriends: [],
      };
      return c.json(response);
    }

    const [banStatuses, allPlayers] = await Promise.all([
      getVACBanStatus(friendIds),
      getPlayerSummaries(friendIds),
    ]);

    const allFriends: FriendProfile[] = allPlayers.map((player) => {
      const banInfo = banStatuses.find((ban) => ban.SteamId === player.steamid);
      return {
        ...player,
        VACBanned: banInfo?.VACBanned ?? false,
        NumberOfVACBans: banInfo?.NumberOfVACBans ?? 0,
        NumberOfGameBans: banInfo?.NumberOfGameBans ?? 0,
        DaysSinceLastBan: banInfo?.DaysSinceLastBan ?? 0,
        CommunityBanned: banInfo?.CommunityBanned ?? false,
        EconomyBan: banInfo?.EconomyBan ?? "none",
      };
    });

    const bannedFriends = allFriends.filter(
      (friend) => friend.VACBanned || friend.NumberOfGameBans > 0
    );

    const response: ApiResponseSteam = {
      message: `Found ${bannedFriends.length} friend(s) with VAC/Game bans`,
      userProfile,
      totalFriends: friendIds.length,
      allFriends,
      bannedFriends,
    };

    return c.json(response);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Steam data" },
      500
    );
  }
});

// @POST /api/v2/leetify
app.post("/leetify", async (c) => {
  try {
    const body = await c.req.json<LeetifyRequestBody>();
    const { steamId } = body;

    if (!steamId) {
      return c.json({ error: "Steam ID is required" }, 400);
    }

    if (!isValidSteam64Id(steamId)) {
      return c.json({ error: "Invalid Steam64 ID. Must be a 17-digit number" }, 400);
    }

    const profile = await getCachedLeetifyProfile(steamId);

    if (!profile) {
      const response: LeetifyApiResponse = { stats: null, message: "Profile not found on Leetify" };
      return c.json(response);
    }

    const matches = await getCachedLeetifyMatches(steamId);
    const matchStats = calculateMatchStats(matches);
    const stats = transformLeetifyData(profile, matchStats);

    const response: LeetifyApiResponse = { stats };
    return c.json(response);
  } catch (error) {
    return c.json(
      { error: error instanceof Error ? error.message : "Failed to fetch Leetify data" },
      500
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
