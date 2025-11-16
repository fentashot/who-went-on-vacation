import { getThemeFromCookies } from "@/lib/theme-actions";
import { ThemeProvider } from "@/contexts/theme-context";
import { HomeClient } from "@/app/home-client";

export default async function Home() {
  const theme = await getThemeFromCookies();

  return (
    <ThemeProvider initialTheme={theme}>
      <HomeClient />
    </ThemeProvider>
  );
}
