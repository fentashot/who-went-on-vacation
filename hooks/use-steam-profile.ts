"use client";

import { useState } from "react";
import { type ApiResponse } from "@/types/steam";
import { createCacheKey } from "@/lib/utils";

// Cache outside hook to persist across component re-renders
const profileCache = new Map<string, ApiResponse>();

export function useSteamProfile() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async (profileId: string) => {
    const cacheKey = createCacheKey(profileId);

    // Check cache first
    if (profileCache.has(cacheKey)) {
      setResult(profileCache.get(cacheKey)!);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/steam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl: profileId }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data);
        profileCache.set(cacheKey, data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return { loading, result, error, fetchProfile };
}
