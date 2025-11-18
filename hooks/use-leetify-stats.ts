import { useQuery } from "@tanstack/react-query";
import { type LeetifyDisplayStats } from "@/types/leetify";

/**
 * Fetch Leetify stats
 */
async function fetchLeetifyStats(steamId: string): Promise<LeetifyDisplayStats | null> {
  const response = await fetch("/api/leetify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ steamId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch Leetify stats");
  }

  // Return null if profile not found, otherwise return stats
  return data.stats;
}/**
 * Hook to fetch Leetify stats
 */
export function useLeetifyStats(steamId: string | null | undefined) {
  return useQuery({
    queryKey: ["leetify-stats", steamId],
    queryFn: () => fetchLeetifyStats(steamId!),
    enabled: !!steamId,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
    // Cache errors for 5 minutes to prevent repeated failed requests
    retryOnMount: false,
    throwOnError: false,
  });
}
