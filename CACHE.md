# Cache System Documentation

## Overview

Aplikacja używa **dwupoziomowego systemu cache** dla optymalizacji wydajności:

1. **Server-side Cache** (Next.js 16 `unstable_cache`)
2. **Client-side Cache** (JavaScript Map w pamięci)

---

## 🔵 Server-side Cache (Next.js 16)

### Lokalizacja

`/app/api/steam/route.ts`

### Konfiguracja

```typescript
const CACHE_REVALIDATE_TIME = 3600; // 1 godzina (w sekundach)
```

### Cached Functions

#### 1. `getCachedVanityUrl`

- **Cel**: Resolve Steam vanity URL → Steam ID
- **Cache Key**: `['vanity-url']`
- **Tag**: `steam-vanity`
- **Czas**: 1 godzina

#### 2. `getCachedFriendList`

- **Cel**: Lista znajomych użytkownika
- **Cache Key**: `['friend-list']`
- **Tag**: `steam-friends`
- **Czas**: 1 godzina

#### 3. `getCachedPlayerSummaries`

- **Cel**: Informacje o profilach graczy
- **Cache Key**: `['player-summaries']`
- **Tag**: `steam-players`
- **Czas**: 1 godzina

#### 4. `getCachedVACBanStatus`

- **Cel**: Status VAC/Game banów
- **Cache Key**: `['vac-ban-status']`
- **Tag**: `steam-bans`
- **Czas**: 1 godzina

### Zalety

✅ Współdzielony cache między wszystkimi użytkownikami  
✅ Zmniejsza obciążenie Steam API  
✅ Automatyczny revalidation po 1 godzinie  
✅ Szybsze odpowiedzi dla często wyszukiwanych profili  
✅ Respektuje limity Steam API

### Invalidation

Możesz manualnie wyczyścić cache używając tagów:

```typescript
import { revalidateTag } from "next/cache";

revalidateTag("steam-friends"); // Czyści cache listy znajomych
revalidateTag("steam-players"); // Czyści cache profili
revalidateTag("steam-bans"); // Czyści cache statusów banów
revalidateTag("steam-vanity"); // Czyści cache vanity URLs
```

---

## 🟢 Client-side Cache (Browser)

### Lokalizacja

`/contexts/profile-context.tsx`

### Implementacja

```typescript
const profileCache = new Map<string, ApiResponse>();
```

### Działanie

- Cache istnieje **tylko w pamięci przeglądarki**
- Znika po odświeżeniu strony (F5)
- Unikalny dla każdego użytkownika
- **Instant loading** podczas nawigacji w tej samej sesji

### Cache Key

```typescript
// Z /lib/utils.ts
export function createCacheKey(input: string): string {
  return input.toLowerCase().trim();
}
```

### Zalety

✅ Natychmiastowe ładowanie przy powrocie do profilu  
✅ Brak dodatkowych requestów podczas sesji  
✅ Szybsza nawigacja między profilami  
✅ Nie wymaga sieci dla już załadowanych profili

---

## 🔄 Cache Flow

### Pierwsze wyszukiwanie profilu

```
1. User search → 2. Client cache (MISS) → 3. API route
                                              ↓
4. Server cache (MISS) → 5. Steam API → 6. Cache & return
   ↓
7. Client receives & caches → 8. Display
```

### Drugie wyszukiwanie tego samego profilu (ta sama sesja)

```
1. User search → 2. Client cache (HIT) → 3. Instant display ✨
```

### Drugie wyszukiwanie (nowa sesja / inny użytkownik)

```
1. User search → 2. Client cache (MISS) → 3. API route
                                              ↓
4. Server cache (HIT) → 5. Return cached data → 6. Display ⚡
```

---

## ⚙️ Configuration

### Zmiana czasu cache

Edytuj `/app/api/steam/route.ts`:

```typescript
const CACHE_REVALIDATE_TIME = 3600; // Zmień na żądaną wartość (sekundy)
```

**Przykłady:**

- `1800` = 30 minut
- `3600` = 1 godzina (obecny)
- `7200` = 2 godziny
- `86400` = 24 godziny

### Wyłączenie cache

**Server-side:**

```typescript
// Ustaw revalidate na 0 (brak cache)
const CACHE_REVALIDATE_TIME = 0;
```

**Client-side:**

```typescript
// W profile-context.tsx, zakomentuj sprawdzanie cache:
// if (profileCache.has(cacheKey)) {
//   setCurrentProfile(profileCache.get(cacheKey)!);
//   return true;
// }
```

---

## 📊 Performance Impact

### Przed cache (każde wyszukiwanie):

- 4-6 requestów do Steam API
- ~2-4 sekundy ładowania
- Limity API mogą być szybko osiągnięte

### Po cache (drugi raz):

- **Client cache**: 0 requestów, <50ms
- **Server cache**: 0 requestów do Steam, ~200ms
- Większa niezawodność, mniej błędów API

---

## 🚀 Best Practices

1. **Nie cache'uj błędów** - tylko poprawne odpowiedzi są cache'owane
2. **Używaj tagów** - łatwa invalidation konkretnych danych
3. **Monitoruj rozmiar** - client cache rośnie z każdym wyszukaniem (resetuje się po F5)
4. **Dostosuj czas** - VAC bany zmieniają się rzadko, więc cache może być dłuższy

---

## 📝 Notes

- Steam API ma limit **100,000 wywołań/dzień**
- Client cache **nie persystuje** między sesjami (celowo)
- Server cache działa na **wszystkich serverless functions** (współdzielony)
- Next.js 16 używa **unstable_cache** (może się zmienić w przyszłości)
