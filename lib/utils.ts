import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Load grid size from localStorage or return default value
export function getStoredGridSize(): number {
  if (typeof window === "undefined") return 18;
  const saved = localStorage.getItem("gridSize");
  return saved ? Number(saved) : 18;
}

//Save grid size to localStorage
export function saveGridSize(size: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("gridSize", String(size));
}

//Create a cache key from profile ID
export function createCacheKey(profileId: string): string {
  return profileId.trim().toLowerCase();
}

/**
 * Filter and sort friends based on search query and sort order
 */
export function filterAndSortFriends<
  T extends { personaname: string; DaysSinceLastBan: number }
>(friends: T[], searchQuery: string, sortOrder: "newest" | "oldest"): T[] {
  return friends
    .filter(
      (f) =>
        !searchQuery.trim() ||
        f.personaname.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aDays = a.DaysSinceLastBan || 0;
      const bDays = b.DaysSinceLastBan || 0;
      return sortOrder === "newest" ? aDays - bDays : bDays - aDays;
    });
}
