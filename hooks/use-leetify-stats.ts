import { useQuery } from "@tanstack/react-query";
import type { LeetifyDisplayStats, LeetifyApiResponse } from "@/types/leetify";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes
const GC_TIME = 1000 * 60 * 60; // 1 hour

async function fetchLeetifyStats(steamId: string): Promise<LeetifyDisplayStats | null> {
  const response = await fetch("/api/v2/leetify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steamId }),
  });

  const data: LeetifyApiResponse | { error: string } = await response.json();

  if (!response.ok || "error" in data) {
    throw new Error("error" in data ? data.error : "Failed to fetch Leetify stats");
  }

  return data.stats;
}

export function useLeetifyStats(steamId: string | null | undefined) {
  return useQuery({
    queryKey: ["leetify-stats", steamId],
    queryFn: () => fetchLeetifyStats(steamId!),
    enabled: !!steamId,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    retry: 1,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retryOnMount: false,
    throwOnError: false,
  });
}
