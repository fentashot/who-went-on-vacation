// Leetify API Types based on actual API response from https://api.leetify.com

export interface LeetifyProfileResponse {
  privacy_mode: string;
  winrate: number;
  total_matches: number;
  first_match_date: string;
  name: string;
  bans: unknown[];
  steam64_id: string;
  id: string;
  ranks: LeetifyRanks;
  rating: LeetifyRating;
  stats: LeetifyStats;
  recent_games?: LeetifyRecentGame[];
}

export interface LeetifyRanks {
  leetify: number;
  premier: number | null;
  faceit: number | null;
  faceit_elo: number | null;
  wingman: number | null;
  renown: number | null;
  competitive: Array<{
    map_name: string;
    rank: number;
  }> | null;
}

export interface LeetifyRating {
  aim: number;
  positioning: number;
  utility: number;
  clutch: number;
  opening: number;
  ct_leetify: number;
  t_leetify: number;
}

export interface LeetifyStats {
  accuracy_enemy_spotted: number;
  accuracy_head: number;
  counter_strafing_good_shots_ratio: number;
  ct_opening_aggression_success_rate: number;
  ct_opening_duel_success_percentage: number;
  flashbang_hit_foe_avg_duration: number;
  flashbang_hit_foe_per_flashbang: number;
  flashbang_hit_friend_per_flashbang: number;
  flashbang_leading_to_kill: number;
  flashbang_thrown: number;
  he_foes_damage_avg: number;
  he_friends_damage_avg: number;
  preaim: number;
  reaction_time_ms: number;
  spray_accuracy: number;
  t_opening_aggression_success_rate: number;
  t_opening_duel_success_percentage: number;
  traded_deaths_success_percentage: number;
  trade_kill_opportunities_per_round: number;
  trade_kills_success_percentage: number;
  utility_on_death_avg: number;
  kd_ratio: number;
  kills_per_round: number;
  deaths_per_round: number;
}

export interface LeetifyRecentGame {
  game_id: string;
  game_mode: string;
  map_name: string;
  started_at: string;
  result: string;
  score: string;
  kills: number;
  deaths: number;
  assists: number;
}

/** Individual match stat entry from Leetify matches API */
export interface LeetifyMatchStat {
  total_kills: number;
  total_deaths: number;
  total_hs_kills: number;
  dpr: number;
  rounds_count: number;
  total_damage: number;
}

/** Calculated stats from match history */
export interface MatchStatsResult {
  kd: number;
  hsP: number;
  avgDpr: number;
  killsPerRound: number;
}

/** Skill bar data for UI */
export interface SkillData {
  name: string;
  value: number;
  color: string;
}

/** Simplified stats for UI display */
export interface LeetifyDisplayStats {
  rating: number;
  matches: number;
  faceit: number | null;
  faceit_elo: number | null;
  premier: number | null;
  competitive: number;
  kd: number;
  preaim: number;
  headAccuracy: number;
  winrate: number;
  killsPerRound: number;
  spottedAccuracy: number;
  damagePerRound: number;
  timeToDamage: string;
  sprayAccuracy: number;
  skills: SkillData[];
  winHistory: string[];
  nickname: string;
  lastMatchAt: string;
}

/** API response for /api/v2/leetify */
export interface LeetifyApiResponse {
  stats: LeetifyDisplayStats | null;
  message?: string;
}
