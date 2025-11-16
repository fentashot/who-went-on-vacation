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
