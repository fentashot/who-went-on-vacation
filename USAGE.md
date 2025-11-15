# Jak używać Steam VAC Ban Checker

## Przygotowanie

Przed pierwszym użyciem upewnij się, że:

1. ✅ Masz zainstalowane Node.js (wersja 18 lub nowsza)
2. ✅ Masz konto Steam
3. ✅ Masz klucz Steam Web API (zobacz SETUP.md)
4. ✅ Skonfigurowałeś plik `.env.local` z kluczem API

## Uruchamianie aplikacji

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## Korzystanie z aplikacji

### Krok 1: Znajdź link do profilu Steam

Możesz użyć własnego profilu lub profilu innego gracza. Link może mieć jeden z formatów:

- **Nazwa użytkownika**: `https://steamcommunity.com/id/gaben`
- **SteamID64**: `https://steamcommunity.com/profiles/76561197960287930`
- **Samo SteamID64**: `76561197960287930`

#### Jak znaleźć swój link?

1. Zaloguj się na Steam
2. Kliknij swoją nazwę użytkownika (prawy górny róg)
3. Wybierz "Profil"
4. Skopiuj link z paska adresu przeglądarki

### Krok 2: Wklej link i sprawdź

1. Wklej skopiowany link w pole "Steam Profile URL"
2. Kliknij przycisk "Check VAC Bans"
3. Poczekaj na wyniki (może to potrwać kilka sekund)

### Krok 3: Przejrzyj wyniki

Aplikacja wyświetli:

- **Całkowitą liczbę znajomych** na tym koncie
- **Liczbę znajomych z banami**
- **Szczegółową listę** każdej zbanowanej osoby, zawierającą:
  - Avatar i nazwa użytkownika
  - Link do profilu
  - Typ bana (VAC, Game, Community, Trade)
  - Liczba banów
  - Ile dni temu otrzymano ostatni ban

## Przykładowe scenariusze

### Sprawdzenie własnych znajomych

```
1. Wklej: https://steamcommunity.com/id/twoja_nazwa
2. Kliknij "Check VAC Bans"
3. Zobacz, którzy z Twoich znajomych mają bany
```

### Sprawdzenie profilu publicznego

```
1. Znajdź publiczny profil gracza
2. Skopiuj link do jego profilu
3. Wklej i sprawdź jego znajomych
```

## Rodzaje banów

### 🔴 VAC Ban (Valve Anti-Cheat)

- Automatyczny ban za używanie cheatów
- Permanentny
- Aplikacja pokazuje ile dni temu został nadany

### 🟠 Game Ban

- Ban nadany przez dewelopera gry
- Może być permanentny lub czasowy
- Pokazuje liczbę game banów

### 🟡 Community Ban

- Ban społecznościowy Steam
- Ogranicza interakcje społeczne

### 🟣 Trade Ban

- Zakaz handlu przedmiotami
- Może być "none", "probation" lub "banned"

## Rozwiązywanie problemów

### Błąd: "Profile is private"

**Przyczyna**: Profil jest ustawiony jako prywatny

**Rozwiązanie**:

1. Zaloguj się na Steam
2. Przejdź do Profil → Edit Profile → Privacy Settings
3. Ustaw "My profile" na "Public"
4. Zapisz i spróbuj ponownie

### Błąd: "Invalid Steam profile URL"

**Przyczyna**: Niepoprawny format linku

**Rozwiązanie**:

- Upewnij się, że link zaczyna się od `https://steamcommunity.com/`
- Sprawdź czy link zawiera `/id/` lub `/profiles/`
- Spróbuj skopiować link bezpośrednio z paska adresu

### Błąd: "Steam API key not configured"

**Przyczyna**: Brak klucza API lub źle skonfigurowany

**Rozwiązanie**:

1. Sprawdź czy istnieje plik `.env.local`
2. Upewnij się, że zawiera: `STEAM_API_KEY=twój_klucz`
3. Zrestartuj serwer deweloperski (`Ctrl+C`, potem `npm run dev`)

### "No friends found"

**Możliwe przyczyny**:

- Profil nie ma znajomych
- Lista znajomych jest prywatna
- Profil jest nowy i nie dodał jeszcze nikogo

## Wskazówki

💡 **Najlepsze praktyki:**

- Używaj aplikacji tylko z publicznymi profilami
- Nie udostępniaj swojego klucza API nikomu
- Pamiętaj, że aplikacja nie przechowuje żadnych danych

⚠️ **Ważne:**

- Steam Web API ma limity requestów (może być wolniejsze przy dużej liczbie znajomych)
- Aplikacja działa tylko z publicznymi profilami i listami znajomych
- Wyniki są w czasie rzeczywistym - bazują na aktualnych danych Steam

## Często zadawane pytania

**Q: Czy aplikacja przechowuje moje dane?**
A: Nie, wszystkie zapytania są przetwarzane w czasie rzeczywistym i nic nie jest zapisywane.

**Q: Czy mogę sprawdzić prywatne profile?**
A: Nie, Steam API nie pozwala na dostęp do prywatnych profili.

**Q: Czy to legalne?**
A: Tak, aplikacja używa oficjalnego Steam Web API, które jest publiczne i dostępne dla deweloperów.

**Q: Jak często mogę sprawdzać profile?**
A: Steam API ma limity, ale dla normalnego użytkowania są wystarczające.

**Q: Co jeśli znajomy ma ban, ale się nie pokazuje?**
A: Upewnij się, że jego profil jest publiczny. Niektóre bany mogą być też odwołane przez Steam Support.
