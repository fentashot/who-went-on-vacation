import { getThemeFromCookies } from "@/lib/theme-actions";
import { ThemeProvider } from "@/contexts/theme-context";
import { PageClient } from "@/app/id/[steamid]/page-client";

interface ProfilePageProps {
  params: Promise<{ steamid: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { steamid } = await params;
  const theme = await getThemeFromCookies();

  return (
    <ThemeProvider initialTheme={theme}>
      <PageClient steamid={steamid} />
    </ThemeProvider>
  );
}
