import { NextRequest, NextResponse } from "next/server";
import {
  extractSteamId,
  resolveVanityUrl,
  getFriendList,
  getPlayerSummaries,
  getVACBanStatus,
} from "@/lib/steam-helpers";

const STEAM_API_KEY = process.env.STEAM_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!STEAM_API_KEY) {
      return NextResponse.json(
        {
          error:
            "Steam API key not configured. Please add STEAM_API_KEY to your .env.local file. Get your key from: https://steamcommunity.com/dev/apikey",
        },
        { status: 500 }
      );
    }

    if (STEAM_API_KEY === "your_steam_api_key_here") {
      return NextResponse.json(
        {
          error:
            "Please replace the placeholder STEAM_API_KEY in .env.local with your actual Steam API key from: https://steamcommunity.com/dev/apikey",
        },
        { status: 500 }
      );
    }

    const { profileUrl } = await request.json();

    if (!profileUrl) {
      return NextResponse.json(
        { error: "Profile URL is required" },
        { status: 400 }
      );
    }    // Extract Steam ID from URL
    let steamId = extractSteamId(profileUrl);

    // If it's a vanity URL, resolve it
    if (steamId && !/^\d{17}$/.test(steamId)) {
      steamId = await resolveVanityUrl(steamId);
    }

    if (!steamId) {
      return NextResponse.json(
        { error: "Invalid Steam profile URL" },
        { status: 400 }
      );
    }

    // Get user profile data
    const userProfile = await getPlayerSummaries([steamId]);
    const userBanStatus = await getVACBanStatus([steamId]);

    const userData = {
      ...userProfile[0],
      ...userBanStatus[0],
    };

    // Get friend list
    const friendIds = await getFriendList(steamId);

    if (friendIds.length === 0) {
      return NextResponse.json({
        message: "No friends found or profile is private",
        userProfile: userData,
        totalFriends: 0,
        allFriends: [],
        bannedFriends: [],
      });
    }

    // Get VAC ban status for all friends
    const banStatuses = await getVACBanStatus(friendIds);

    // Get player summaries for all friends
    const allPlayers = await getPlayerSummaries(friendIds);

    // Combine player info with ban info for all friends
    const allFriends = allPlayers.map((player) => {
      const banInfo = banStatuses.find((ban) => ban.SteamId === player.steamid);
      return {
        ...player,
        ...banInfo,
      };
    });

    // Filter friends with VAC bans
    const bannedFriends = allFriends.filter(
      (friend) =>
        friend.VACBanned ||
        (friend.NumberOfGameBans && friend.NumberOfGameBans > 0)
    );

    return NextResponse.json({
      message: `Found ${bannedFriends.length} friend(s) with VAC/Game bans`,
      userProfile: userData,
      totalFriends: friendIds.length,
      allFriends,
      bannedFriends,
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
