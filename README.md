# Steam VAC Ban Checker

Aplikacja Next.js do sprawdzania znajomych na Steamie z banami VAC.

## Funkcjonalności

- Wprowadź link do profilu Steam
- Wyświetla wszystkich znajomych z:
  - VAC Ban
  - Game Ban
  - Community Ban
  - Trade Ban
- Pokazuje szczegóły każdego bana (liczba banów, dni od ostatniego bana)
- Wyświetla awatary i linki do profili

## Wymagania

- Node.js 18+
- Klucz Steam Web API

## Instalacja

1. Sklonuj repozytorium:

```bash
git clone <your-repo-url>
cd steam-info-app
```

2. Zainstaluj zależności:

```bash
npm install
```

3. Uzyskaj klucz Steam Web API:

   - Przejdź na https://steamcommunity.com/dev/apikey
   - Zaloguj się na swoje konto Steam
   - Wypełnij formularz i uzyskaj swój klucz API

4. Utwórz plik `.env.local`:

```bash
cp .env.example .env.local
```

5. Edytuj `.env.local` i dodaj swój klucz API:

```
STEAM_API_KEY=your_actual_api_key_here
```

## Uruchomienie

Uruchom serwer deweloperski:

```bash
npm run dev
```

Otwórz [http://localhost:3000](http://localhost:3000) w przeglądarce.

## Użycie

1. Wklej link do profilu Steam w jednym z formatów:

   - `https://steamcommunity.com/id/username`
   - `https://steamcommunity.com/profiles/76561198XXXXXXXXX`
   - Samo ID Steam (17 cyfr)

2. Kliknij "Check VAC Bans"

3. Aplikacja wyświetli:
   - Całkowitą liczbę znajomych
   - Liczbę znajomych z banami
   - Szczegółową listę zbanowanych znajomych z informacjami o banach

**Uwaga:** Profil użytkownika musi być publiczny, aby aplikacja mogła pobrać listę znajomych.

## API Endpoints

### POST /api/steam

Sprawdza VAC bany znajomych użytkownika Steam.

**Request Body:**

```json
{
  "profileUrl": "https://steamcommunity.com/id/username"
}
```

**Response:**

```json
{
  "message": "Found X friend(s) with VAC/Game bans",
  "totalFriends": 100,
  "bannedFriends": [
    {
      "steamid": "76561198...",
      "personaname": "Username",
      "profileurl": "https://steamcommunity.com/profiles/...",
      "avatar": "...",
      "avatarmedium": "...",
      "avatarfull": "...",
      "VACBanned": true,
      "NumberOfVACBans": 1,
      "NumberOfGameBans": 0,
      "DaysSinceLastBan": 365,
      "CommunityBanned": false,
      "EconomyBan": "none"
    }
  ]
}
```

## Technologie

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Steam Web API](https://steamcommunity.com/dev)

## Prywatność

- Wszystkie zapytania są przetwarzane po stronie serwera
- Klucz API nie jest ujawniany klientowi
- Nie przechowujemy żadnych danych użytkownika

## Licencja

MIT
