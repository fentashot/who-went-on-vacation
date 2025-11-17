"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { type ApiResponseSteam } from "@/types/steam";
import { createCacheKey } from "@/lib/utils";

interface ProfileContextType {
  currentProfile: ApiResponseSteam | null;
  loading: boolean;
  error: string | null;
  fetchAndSetProfile: (profileId: string) => Promise<boolean>;
  clearProfile: () => void;
  clearError: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// Cache outside context to persist
const profileCache = new Map<string, ApiResponseSteam>();

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [currentProfile, setCurrentProfile] = useState<ApiResponseSteam | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAndSetProfile = useCallback(async (profileId: string) => {
    const cacheKey = createCacheKey(profileId);

    // Check cache first
    if (profileCache.has(cacheKey)) {
      setCurrentProfile(profileCache.get(cacheKey)!);
      setError(null);
      setLoading(false);
      return true;
    }

    setLoading(true);
    setError(null);
    // Don't reset currentProfile here - keep existing content visible

    try {
      const res = await fetch("/api/steam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUrl: profileId }),
      });
      const data = await res.json();

      console.log(data);

      if (res.ok && data.allFriends.length > 0) {
        setCurrentProfile(data);
        setError(null);
        profileCache.set(cacheKey, data);
        return true;
      } else {
        setError(data.error || "An error occurred");
        // Don't reset profile on error - keep showing previous profile
        return false;
      }
    } catch {
      setError("Failed to connect to the server");
      // Don't reset profile on error - keep showing previous profile
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setCurrentProfile(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        loading,
        error,
        fetchAndSetProfile,
        clearProfile,
        clearError,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
