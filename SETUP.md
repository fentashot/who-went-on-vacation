# Szybki start

## Krok po kroku:

1. **Uzyskaj klucz Steam API:**

   - Odwiedź: https://steamcommunity.com/dev/apikey
   - Zaloguj się na swoje konto Steam
   - W polu "Domain Name" wpisz: localhost
   - Kliknij "Register" i skopiuj klucz

2. **Skonfiguruj środowisko:**

   ```bash
   cp .env.example .env.local
   ```

   Następnie edytuj `.env.local` i wklej swój klucz:

   ```
   STEAM_API_KEY=TWOJ_KLUCZ_TUTAJ
   ```

3. **Zainstaluj zależności:**

   ```bash
   npm install
   ```

4. **Uruchom aplikację:**

   ```bash
   npm run dev
   ```

5. **Otwórz w przeglądarce:**
   ```
   http://localhost:3000
   ```

## Testowanie:

Aby przetestować aplikację, będziesz potrzebować:

- Publiczny profil Steam (swój lub kogoś innego)
- Link do profilu w formacie:
  - `https://steamcommunity.com/id/nazwa_użytkownika`
  - `https://steamcommunity.com/profiles/76561198XXXXXXXXX`

**Uwaga:** Profil musi być publiczny (nie prywatny), aby aplikacja mogła odczytać listę znajomych.

## Możliwe problemy:

### "Steam API key not configured"

- Upewnij się, że utworzyłeś plik `.env.local`
- Sprawdź, czy klucz API jest poprawnie wklejony
- Zrestartuj serwer deweloperski po dodaniu klucza

### "Profile is private"

- Profil Steam musi być publiczny
- Zmień ustawienia prywatności na Steam w: Profile → Edit Profile → Privacy Settings

### "Invalid Steam profile URL"

- Sprawdź format linku
- Upewnij się, że link zawiera ID użytkownika lub SteamID64
