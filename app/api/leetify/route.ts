import { NextRequest, NextResponse } from "next/server";
import {
  isValidSteam64Id,
  getCachedLeetifyMatches,
  calculateMatchStats,
  getCachedLeetifyProfile,
  transformLeetifyData,
} from "@/lib/leetify-helpers";

export async function POST(request: NextRequest) {
  try {
    const { steamId } = await request.json();

    if (!steamId) {
      return NextResponse.json(
        { error: "Steam ID is required" },
        { status: 400 }
      );
    }

    if (!isValidSteam64Id(steamId)) {
      return NextResponse.json(
        { error: "Invalid Steam64 ID. Must be a 17-digit number" },
        { status: 400 }
      );
    }

    const profile = await getCachedLeetifyProfile(steamId);

    if (!profile) {
      // Return success with null stats instead of error to enable caching
      return NextResponse.json({
        stats: null,
        message: "Profile not found on Leetify"
      });
    }

    const matches = await getCachedLeetifyMatches(steamId);
    const matchStats = calculateMatchStats(matches);
    const stats = transformLeetifyData(profile, matchStats);

    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Leetify stats",
      },
      { status: 500 }
    );
  }
}