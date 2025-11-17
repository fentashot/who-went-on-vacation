import {
  getThemeFromCookies,
  getGridSizeFromCookies,
  getCompactViewFromCookies,
} from "@/lib/theme-actions";
import { ThemeProvider } from "@/contexts/theme-context";
import { ProfileProvider } from "@/contexts/profile-context";
import { HomeClient } from "@/app/home-client";

export default async function Home() {
  const theme = await getThemeFromCookies();
  const gridSize = await getGridSizeFromCookies();
  const compactView = await getCompactViewFromCookies();

  return (
    <ThemeProvider
      initialTheme={theme}
      initialGridSize={gridSize}
      initialCompactView={compactView}
    >
      <ProfileProvider>
        <HomeClient />
      </ProfileProvider>
    </ThemeProvider>
  );
}
