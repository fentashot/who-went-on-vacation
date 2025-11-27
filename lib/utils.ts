import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Filter and sort friends by name and ban date */
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
