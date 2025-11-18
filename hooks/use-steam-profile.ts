import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type ApiResponseSteam } from "@/types/steam";

/**
 * useSteamProfile
 * ----------------
 * Wrapper around React Query to fetch a Steam profile (including friends & bans).
 * - Returns cached data for `staleTime` (30 minutes) to avoid repeated API hits.
 * - `refetchOnMount: false` and `refetchOnWindowFocus: false` to keep UX stable
 *   when users navigate or switch tabs.
 * - Always returns the API response shape (even for private profiles) so UI
 *   logic can handle empty friend lists gracefully.
 */

/**
 * Fetch Steam profile data
 */
async function fetchSteamProfile(profileUrl: string): Promise<ApiResponseSteam> {
  const response = await fetch("/api/steam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrl }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch Steam profile");
  }

  // Always return data, even if no friends (private profile)
  return data;
}/**
 * Hook to fetch Steam profile
 */
export function useSteamProfile(profileUrl: string | null) {
  return useQuery({
    queryKey: ["steam-profile", profileUrl],
    queryFn: () => fetchSteamProfile(profileUrl!),
    enabled: !!profileUrl,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnMount: false, // Don't refetch on mount if data is still fresh
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

/**
 * Hook to prefetch Steam profile (for instant navigation)
 */
export function usePrefetchSteamProfile() {
  const queryClient = useQueryClient();

  return (profileUrl: string) => {
    queryClient.prefetchQuery({
      queryKey: ["steam-profile", profileUrl],
      queryFn: () => fetchSteamProfile(profileUrl),
      staleTime: 1000 * 60 * 30,
    });
  };
}

/**
 * Hook to fetch Steam profile with mutation (for search)
 */
export function useFetchSteamProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchSteamProfile,
    onSuccess: (data, profileUrl) => {
      // Cache the result
      queryClient.setQueryData(["steam-profile", profileUrl], data);
    },
  });
}
