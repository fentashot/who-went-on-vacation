"use server";

import { cookies } from "next/headers";

export type Theme =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "white";

const THEME_COOKIE_NAME = "steam-vac-theme";
const GRID_SIZE_COOKIE_NAME = "steam-vac-grid-size";
const COMPACT_VIEW_COOKIE_NAME = "steam-vac-compact-view";
const DEFAULT_GRID_SIZE = 18;

/**
 * Get theme from cookies (server-side)
 */
export async function getThemeFromCookies(): Promise<Theme> {
  const cookieStore = await cookies();
  const theme = cookieStore.get(THEME_COOKIE_NAME)?.value;

  if (
    theme &&
    ["red", "blue", "green", "yellow", "purple", "pink", "white"].includes(
      theme
    )
  ) {
    return theme as Theme;
  }

  return "white";
}

/**
 * Set theme in cookies (server action)
 */
export async function setThemeInCookies(theme: Theme): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Get grid size from cookies (server-side)
 */
export async function getGridSizeFromCookies(): Promise<number> {
  const cookieStore = await cookies();
  const gridSize = cookieStore.get(GRID_SIZE_COOKIE_NAME)?.value;

  if (gridSize) {
    const parsed = Number(gridSize);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) {
      return parsed;
    }
  }

  return DEFAULT_GRID_SIZE;
}

/**
 * Set grid size in cookies (server action)
 */
export async function setGridSizeInCookies(size: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GRID_SIZE_COOKIE_NAME, String(size), {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });
}

/**
 * Get compact view preference from cookies (server-side)
 */
export async function getCompactViewFromCookies(): Promise<boolean> {
  const cookieStore = await cookies();
  const compactView = cookieStore.get(COMPACT_VIEW_COOKIE_NAME)?.value;

  return compactView === "true";
}

/**
 * Set compact view preference in cookies (server action)
 */
export async function setCompactViewInCookies(compact: boolean): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COMPACT_VIEW_COOKIE_NAME, String(compact), {
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
    sameSite: "lax",
  });
}
