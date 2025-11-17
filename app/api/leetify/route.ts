import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import type {
  LeetifyProfileResponse,
  LeetifyDisplayStats,
} from "@/types/leetify";

const LEETIFY_API_KEY = process.env.LEETIFY_API_KEY;
const LEETIFY_BASE_URL = "https://api-public.cs-prod.leetify.com";
const CACHE_REVALIDATE_TIME = 1800;

function isValidSteam64Id(steamId: string): boolean {
  return /^\d{17}$/.test(steamId);
}

const getCachedLeetifyMatches = unstable_cache(
  async (steam64Id: string) => {
    const headers: HeadersInit = {};
    if (LEETIFY_API_KEY) headers["_leetify_key"] = LEETIFY_API_KEY;

    const response = await fetch(
      `${LEETIFY_BASE_URL}/v3/profile/matches?steam64_id=${steam64Id}`,
      { headers }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const playerStats = data
      .map((match: {
        stats?: Array<{
          steam64_id?: string;
          total_kills?: number;
          total_deaths?: number;
          total_hs_kills?: number;
          dpr?: number;
          rounds_count?: number;
          total_damage?: number;
        }>
      }) =>
        match.stats?.find((stat) => stat.steam64_id === steam64Id)
      )
      .filter(Boolean)
      .slice(0, 30)
      .map((stat: {
        total_kills?: number;
        total_deaths?: number;
        total_hs_kills?: number;
        dpr?: number;
        rounds_count?: number;
        total_damage?: number;
      }) => ({
        total_kills: stat.total_kills ?? 0,
        total_deaths: stat.total_deaths ?? 0,
        total_hs_kills: stat.total_hs_kills ?? 0,
        dpr: stat.dpr ?? 0,
        rounds_count: stat.rounds_count ?? 0,
        total_damage: stat.total_damage ?? 0,
      }));

    return playerStats;
  },
  ["leetify-matches"],
  { revalidate: CACHE_REVALIDATE_TIME, tags: ["leetify-stats"] }
);

function calculateMatchStats(
  matches: Array<{
    total_kills: number;
    total_deaths: number;
    total_hs_kills: number;
    dpr: number;
    rounds_count: number;
    total_damage: number;
  }> | null
): { kd: number; hsP: number; avgDpr: number; killsPerRound: number } {
  if (!matches?.length) return { kd: 1.0, hsP: 0, avgDpr: 0, killsPerRound: 0 };

  const totals = matches.reduce(
    (acc, m) => ({
      kills: acc.kills + m.total_kills,
      deaths: acc.deaths + m.total_deaths,
      hsKills: acc.hsKills + m.total_hs_kills,
      damage: acc.damage + m.total_damage,
      rounds: acc.rounds + m.rounds_count,
    }),
    { kills: 0, deaths: 0, hsKills: 0, damage: 0, rounds: 0 }
  );

  const kd = totals.deaths === 0 ? (totals.kills > 0 ? totals.kills : 1.0) : totals.kills / totals.deaths;
  const hsP = totals.kills > 0 ? (totals.hsKills / totals.kills) * 100 : 0;
  const avgDpr = totals.rounds > 0 ? totals.damage / totals.rounds : 0;
  const killsPerRound = totals.rounds > 0 ? totals.kills / totals.rounds : 0;

  return { kd, hsP, avgDpr, killsPerRound };
}

const getCachedLeetifyProfile = unstable_cache(
  async (steam64Id: string) => {
    const headers: HeadersInit = {};
    if (LEETIFY_API_KEY) headers["_leetify_key"] = LEETIFY_API_KEY;

    const response = await fetch(
      `${LEETIFY_BASE_URL}/v3/profile?steam64_id=${steam64Id}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Leetify API error: ${response.status}`);
    }

    return response.json() as Promise<LeetifyProfileResponse>;
  },
  ["leetify-profile"],
  { revalidate: CACHE_REVALIDATE_TIME, tags: ["leetify-stats"] }
);

function transformLeetifyData(
  profile: LeetifyProfileResponse,
  matchStats: { kd: number; hsP: number; avgDpr: number; killsPerRound: number }
): LeetifyDisplayStats {
  const createSkill = (name: string, value: number) => ({
    name,
    value: Math.round(value),
    color: getSkillColor(value),
  });

  const skills = [
    createSkill("Aim", profile.rating?.aim ?? 0),
    createSkill("Utility", profile.rating?.utility ?? 0),
    createSkill("Positioning", profile.rating?.positioning ?? 0),
    createSkill("Opening Duels", (profile.rating?.opening ?? 0) * 100),
    createSkill("Clutching", (profile.rating?.clutch ?? 0) * 100),
  ];

  const winHistory = (profile.recent_games || [])
    .slice(0, 10)
    .map((m) => (m.result === "win" ? "W" : "L"));

  return {
    rating: Math.round((profile.ranks?.leetify ?? 0) * 100) / 100,
    matches: profile.total_matches ?? 0,
    faceit: profile.ranks?.faceit ?? 0,
    premier: profile.ranks?.premier ?? 0,
    competitive: profile.ranks?.competitive?.[0]?.rank ?? 0,
    kd: Math.round(matchStats.kd * 100) / 100,
    headAccuracy: Math.round(matchStats.hsP),
    winrate: Math.round((profile.winrate ?? 0) * 100),
    killsPerRound: Math.round(matchStats.killsPerRound * 100) / 100,
    spottedAccuracy: Math.round((profile.stats?.accuracy_enemy_spotted ?? 0)),
    damagePerRound: Math.round(matchStats.avgDpr),
    timeToDamage: `${Math.round(profile.stats?.reaction_time_ms ?? 0)}ms`,
    sprayAccuracy: Math.round((profile.stats?.spray_accuracy ?? 0)),
    skills,
    winHistory,
    nickname: profile.name ?? "Unknown",
    lastMatchAt: profile.first_match_date ?? "",
  };
}

function getSkillColor(value: number): string {
  if (value >= 70) return "bg-emerald-500";
  if (value >= 50) return "bg-yellow-500";
  if (value >= 30) return "bg-orange-500";
  return "bg-red-500";
}

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
      return NextResponse.json(
        { error: "Profile not found on Leetify" },
        { status: 404 }
      );
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
