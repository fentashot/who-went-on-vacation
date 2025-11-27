import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import type { AppType } from "@/app/api/v2/[[...route]]/route";
import type { ApiResponseSteam } from "@/types/steam";

const STALE_TIME = 1000 * 60 * 30; // 30 minutes
const GC_TIME = 1000 * 60 * 60; // 1 hour

const { api } = hc<AppType>("/");

async function fetchSteamProfile(profileUrl: string): Promise<ApiResponseSteam> {
  const response = await api.v2.steam.$post({
    json: { profileUrl },
  });

  if (!response.ok) {
    const errorData = (await response.json()) as { error?: string };
    throw new Error(errorData.error ?? "Failed to fetch Steam profile");
  }

  const data = await response.json();

  if ("error" in data && typeof data.error === "string") {
    throw new Error(data.error);
  }

  return data as ApiResponseSteam;
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
