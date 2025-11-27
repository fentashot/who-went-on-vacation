import { unstable_cache } from "next/cache";
import type {
  LeetifyProfileResponse,
  LeetifyDisplayStats,
  LeetifyMatchStat,
  MatchStatsResult,
  SkillData,
} from "@/types/leetify";

const LEETIFY_API_KEY = process.env.LEETIFY_API_KEY;
const LEETIFY_BASE_URL = "https://api-public.cs-prod.leetify.com";
const CACHE_TTL = 1800; // 30 minutes

export function isValidSteam64Id(steamId: string): boolean {
  return /^\d{17}$/.test(steamId);
}

interface LeetifyMatchApiEntry {
  stats?: Array<{
    steam64_id?: string;
    total_kills?: number;
    total_deaths?: number;
    total_hs_kills?: number;
    dpr?: number;
    rounds_count?: number;
    total_damage?: number;
  }>;
}

export const getCachedLeetifyMatches = unstable_cache(
  async (steam64Id: string): Promise<LeetifyMatchStat[] | null> => {
    const headers: HeadersInit = {};
    if (LEETIFY_API_KEY) headers["_leetify_key"] = LEETIFY_API_KEY;

    const response = await fetch(
      `${LEETIFY_BASE_URL}/v3/profile/matches?steam64_id=${steam64Id}`,
      { headers }
    );

    if (!response.ok) return null;

    const data: LeetifyMatchApiEntry[] = await response.json();
    const playerStats: LeetifyMatchStat[] = data
      .map((match) => match.stats?.find((stat) => stat.steam64_id === steam64Id))
      .filter((stat): stat is NonNullable<typeof stat> => Boolean(stat))
      .slice(0, 30)
      .map((stat) => ({
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
  { revalidate: CACHE_TTL, tags: ["leetify-stats"] }
);

export function calculateMatchStats(matches: LeetifyMatchStat[] | null): MatchStatsResult {
  if (!matches?.length) return { kd: 0, hsP: 0, avgDpr: 0, killsPerRound: 0 };

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

export const getCachedLeetifyProfile = unstable_cache(
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
  { revalidate: CACHE_TTL, tags: ["leetify-stats"] }
);

export function transformLeetifyData(
  profile: LeetifyProfileResponse,
  matchStats: MatchStatsResult
): LeetifyDisplayStats {
  const createSkill = (name: string, value: number): SkillData => ({
    name,
    value: Math.round(value),
    color: getSkillColor(value),
  });

  const skills: SkillData[] = [
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
    faceit: profile.ranks?.faceit ?? null,
    faceit_elo: profile.ranks?.faceit_elo ?? null,
    premier: profile.ranks?.premier ?? null,
    competitive: profile.ranks?.competitive?.[0]?.rank ?? 0,
    kd: Math.round(matchStats.kd * 100) / 100,
    preaim: Math.round((profile.stats?.preaim ?? 0) * 100) / 100,
    headAccuracy: Math.round(matchStats.hsP),
    winrate: Math.round((profile.winrate ?? 0) * 100),
    killsPerRound: Math.round(matchStats.killsPerRound * 100) / 100,
    spottedAccuracy: Math.round(profile.stats?.accuracy_enemy_spotted ?? 0),
    damagePerRound: Math.round(matchStats.avgDpr),
    timeToDamage: `${Math.round(profile.stats?.reaction_time_ms ?? 0)}ms`,
    sprayAccuracy: Math.round(profile.stats?.spray_accuracy ?? 0),
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
