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

const STEAM_API_KEY = process.env.STEAM_API_KEY;

const app = new Hono().basePath("/api/v2/");

app.get("/hello", async (c) => {
  return c.json({ message: "Hello from Hono 🔥" });
});

// @POST /api/v2/steam
app.post("/steam", async (c) => {
  try {
    if (!STEAM_API_KEY || STEAM_API_KEY === "your_steam_api_key_here") {
      return c.json(
        {
          error:
            "Steam API key not configured. Please add STEAM_API_KEY to your .env file. Get your key from: https://steamcommunity.com/dev/apikey",
        },
        500
      );
    }
    const body = await c.req.json();
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
    const userProfile = await getPlayerSummaries([steamId]);
    const userBanStatus = await getVACBanStatus([steamId]);
    const userData = {
      ...userProfile[0],
      ...userBanStatus[0],
    };
    const friendIds = await getFriendList(steamId);
    if (friendIds.length === 0) {
      return c.json({
        message: "No friends found or profile is private",
        userProfile: userData,
        totalFriends: 0,
        allFriends: [],
        bannedFriends: [],
      });
    }
    const banStatuses = await getVACBanStatus(friendIds);
    const allPlayers = await getPlayerSummaries(friendIds);
    const allFriends = allPlayers.map((player) => {
      const banInfo = banStatuses.find((ban) => ban.SteamId === player.steamid);
      return {
        ...player,
        ...banInfo,
      };
    });
    const bannedFriends = allFriends.filter(
      (friend) =>
        friend.VACBanned ||
        (friend.NumberOfGameBans && friend.NumberOfGameBans > 0)
    );
    return c.json({
      message: `Found ${bannedFriends.length} friend(s) with VAC/Game bans`,
      userProfile: userData,
      totalFriends: friendIds.length,
      allFriends,
      bannedFriends,
    });
  } catch (error) {
    return c.json({
      error:
        error instanceof Error ? error.message : "Failed to fetch Steam data",
    });
  }
});

// @POST /api/v2/leetify
app.post("/leetify", async (c) => {
  try {
    const body = await c.req.json();
    const { steamId } = body;
    if (!steamId) {
      return c.json({ error: "Steam ID is required" }, 400);
    }
    if (!isValidSteam64Id(steamId)) {
      return c.json(
        { error: "Invalid Steam64 ID. Must be a 17-digit number" },
        400
      );
    }
    const profile = await getCachedLeetifyProfile(steamId);
    if (!profile) {
      return c.json({ stats: null, message: "Profile not found on Leetify" });
    }
    const matches = await getCachedLeetifyMatches(steamId);
    const matchStats = calculateMatchStats(matches);
    const stats = transformLeetifyData(profile, matchStats);
    return c.json({ stats });
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch leetify",
      },
      500
    );
  }
});

export const GET = handle(app);
export const POST = handle(app);
