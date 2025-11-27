import { useQuery } from "@tanstack/react-query";
import type { LeetifyDisplayStats } from "@/types/leetify";
import { hc } from "hono/client";
import type { AppType } from "@/app/api/v2/[[...route]]/route";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes
const GC_TIME = 1000 * 60 * 60; // 1 hour

const { api } = hc<AppType>("/");

async function fetchLeetifyStats(
  steamId: string
): Promise<LeetifyDisplayStats | null> {
  const response = await api.v2.leetify.$post({
    json: { steamId },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string };
    throw new Error(errorData.error ?? "Failed to fetch Leetify stats");
  }

  const data = await response.json();

  if ("error" in data && typeof data.error === "string") {
    throw new Error(data.error);
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
