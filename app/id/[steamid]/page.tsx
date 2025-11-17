import {
  getThemeFromCookies,
  getGridSizeFromCookies,
  getCompactViewFromCookies,
} from "@/lib/theme-actions";
import { ThemeProvider } from "@/contexts/theme-context";
import { PageClient } from "@/app/id/[steamid]/page-client";

interface ProfilePageProps {
  params: Promise<{ steamid: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { steamid } = await params;
  const theme = await getThemeFromCookies();
  const gridSize = await getGridSizeFromCookies();
  const compactView = await getCompactViewFromCookies();

  return (
    <ThemeProvider
      initialTheme={theme}
      initialGridSize={gridSize}
      initialCompactView={compactView}
    >
      <PageClient steamid={steamid} />
    </ThemeProvider>
  );
}
