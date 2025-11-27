import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiResponseSteam, ApiErrorResponse } from "@/types/steam";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes
const GC_TIME = 1000 * 60 * 60; // 1 hour

async function fetchSteamProfile(profileUrl: string): Promise<ApiResponseSteam> {
  const response = await fetch("/api/v2/steam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileUrl }),
  });

  const data: ApiResponseSteam | ApiErrorResponse = await response.json();

  if (!response.ok || "error" in data) {
    throw new Error("error" in data ? data.error : "Failed to fetch Steam profile");
  }

  return data;
}

export function useSteamProfile(profileUrl: string | null) {
  return useQuery({
    queryKey: ["steam-profile", profileUrl],
    queryFn: () => fetchSteamProfile(profileUrl!),
    enabled: !!profileUrl,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

export function usePrefetchSteamProfile() {
  const queryClient = useQueryClient();

  return (profileUrl: string) => {
    queryClient.prefetchQuery({
      queryKey: ["steam-profile", profileUrl],
      queryFn: () => fetchSteamProfile(profileUrl),
      staleTime: STALE_TIME,
    });
  };
}

export function useFetchSteamProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchSteamProfile,
    onSuccess: (data, profileUrl) => {
      queryClient.setQueryData(["steam-profile", profileUrl], data);
    },
  });
}
