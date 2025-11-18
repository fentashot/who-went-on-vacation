# 🏗️ Steam VAC Checker - Architektura Aplikacji

## 📋 Spis treści

1. [Przegląd aplikacji](#przegląd-aplikacji)
2. [Architektura technologiczna](#architektura-technologiczna)
3. [Struktura folderów](#struktura-folderów)
4. [Kluczowe komponenty](#kluczowe-komponenty)
5. [Przepływ danych](#przepływ-danych)
6. [Analiza i rekomendacje](#analiza-i-rekomendacje)

---

## 🎯 Przegląd aplikacji

**Steam VAC Checker** to aplikacja Next.js do sprawdzania statusu VAC banów znajomych użytkownika Steam oraz statystyk Leetify dla graczy CS2.

### Główne funkcje:

- ✅ Wyszukiwanie profili Steam (URL/username/Steam64 ID)
- ✅ Wyświetlanie listy znajomych z informacją o VAC banach
- ✅ Integracja ze statystykami Leetify (K/D, HS%, DPR, etc.)
- ✅ Personalizacja UI (7 motywów kolorystycznych)
- ✅ Różne widoki (siatka/kompaktowy)
- ✅ Filtrowanie i sortowanie znajomych
- ✅ Cache'owanie danych (profil + API)

---

## 🛠️ Architektura technologiczna

### Stack technologiczny:

```
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Server Actions
- React Context API
- Cookies (persystencja preferencji)
```

### Wzorce projektowe:

- **Server/Client Component Split** - SSR dla SEO + hydration
- **Context API** - Globalne state management
- **Server Actions** - Mutacje po stronie serwera
- **API Routes** - Proxy dla Steam/Leetify API
- **Caching Strategy** - Multi-level (in-memory + Next.js cache)

---

## 📁 Struktura folderów

```
steam-info-app/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (proxy)
│   │   ├── steam/route.ts        # Steam API endpoint
│   │   └── leetify/route.ts      # Leetify API endpoint
│   ├── id/[steamid]/             # Dynamiczna strona profilu
│   │   ├── page.tsx              # Server Component
│   │   └── page-client.tsx       # Client Component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home - Server Component
│   └── home-client.tsx           # Home - Client Component
│
├── components/                   # Komponenty React
│   ├── friends/                  # Komponenty listy znajomych
│   ├── layout/                   # Komponenty layoutu
│   ├── profile/                  # Komponenty profilu użytkownika
│   ├── search/                   # Komponenty wyszukiwania
│   ├── shared/                   # Współdzielone komponenty
│   └── ui/                       # Shadcn UI komponenty
│
├── contexts/                     # React Context providers
│   ├── profile-context.tsx       # Stan profilu użytkownika
│   └── theme-context.tsx         # Stan motywu UI
│
├── lib/                          # Utility functions & helpers
│   ├── steam-helpers.ts          # Steam API logic
│   ├── leetify-helpers.ts        # Leetify API logic
│   ├── theme-actions.ts          # Server Actions dla motywów
│   └── utils.ts                  # Funkcje pomocnicze
│
└── types/                        # TypeScript type definitions
    ├── steam.ts
    └── leetify.ts
```

---

## 🔑 Kluczowe komponenty

### 1. **Context Providers**

#### ProfileContext (`contexts/profile-context.tsx`)

```typescript
// Zarządza stanem profilu użytkownika Steam
interface ProfileContextType {
  currentProfile: ApiResponseSteam | null; // Dane profilu
  loading: boolean; // Stan ładowania
  error: string | null; // Błędy
  fetchAndSetProfile: (id: string) => Promise<boolean>;
  clearProfile: () => void;
  clearError: () => void;
}
```

**Funkcjonalność:**

- ✅ In-memory cache profili (`Map<cacheKey, profile>`)
- ✅ Automatyczne cache'owanie po pobraniu
- ✅ Stabilne referencje funkcji (`useCallback`)
- ✅ Obsługa błędów bez resetowania poprzednich danych

**Zalety:**

- ✅ Unika duplikowania requestów
- ✅ Szybkie przełączanie między profilami
- ✅ Persystencja danych podczas błędów

**Potencjalne problemy:**

- ⚠️ Cache rośnie w nieskończoność (brak eviction policy)
- ⚠️ Brak TTL (Time To Live) dla cache
- ⚠️ Cache jest per-session (znika po odświeżeniu)

---

#### ThemeContext (`contexts/theme-context.tsx`)

```typescript
interface ThemeContextType {
  theme: Theme; // Aktualny motyw
  themeConfig: ThemeConfig; // Konfiguracja kolorów
  gridSize: number; // Rozmiar siatki
  compactView: boolean; // Tryb kompaktowy
  setTheme: (theme: Theme) => void;
  setGridSize: (size: number) => void;
  setCompactView: (compact: boolean) => void;
}
```

**Funkcjonalność:**

- ✅ 7 predefiniowanych motywów
- ✅ Persystencja w cookies (1 rok)
- ✅ Server-side initial state (SSR-friendly)
- ✅ `useTransition` dla płynnych zmian

**Zalety:**

- ✅ Preferencje zachowane między sesjami
- ✅ SSR - brak migotania przy ładowaniu
- ✅ Type-safe konfiguracja

---

### 2. **API Routes (Proxy Pattern)**

#### Steam API (`app/api/steam/route.ts`)

```typescript
POST / api / steam;
Body: {
  profileUrl: string;
}
Response: ApiResponseSteam;
```

**Funkcjonalność:**

1. Ekstrakcja Steam ID z URL/username
2. Resolving vanity URL → Steam64 ID
3. Pobieranie profilu użytkownika
4. Pobieranie listy znajomych (do 100 naraz)
5. Pobieranie statusów VAC dla wszystkich
6. Łączenie danych profile + VAC status

**Caching:**

- `unstable_cache` z Next.js
- Revalidation: 3600s (1h)
- Cache tags: `steam-vanity`, `steam-friends`, `steam-players`, `steam-bans`

**Zalety:**

- ✅ Ukrywa API key przed frontendem
- ✅ Automatyczne cache'owanie
- ✅ Chunking requestów (max 100 ID na raz)

**Problemy:**

- ⚠️ Brak rate limiting
- ⚠️ Brak error recovery dla częściowych niepowodzeń

---

#### Leetify API (`app/api/leetify/route.ts`)

```typescript
POST / api / leetify;
Body: {
  steamId: string;
}
Response: {
  stats: LeetifyDisplayStats;
}
```

**Funkcjonalność:**

1. Walidacja Steam64 ID (17 cyfr)
2. Pobieranie profilu Leetify
3. Pobieranie ostatnich 30 meczów
4. Kalkulacja statystyk:
   - K/D = suma kills / suma deaths
   - HS% = (suma HS kills / suma kills) × 100
   - K/R = suma kills / suma rund
   - DPR = suma damage / suma rund

**Caching:**

- Revalidation: 1800s (30 min)
- 2 osobne cache: profile + matches

**Zalety:**

- ✅ Dokładne statystyki z rzeczywistych meczów
- ✅ Clean separation of concerns (helpers w osobnym pliku)

---

### 3. **Helpers & Utilities**

#### `lib/steam-helpers.ts`

```typescript
// Funkcje pomocnicze Steam API
-extractSteamId() - // URL → Steam ID
  resolveVanityUrl() - // Username → Steam64 ID
  getFriendList() - // Pobierz znajomych
  getPlayerSummaries() - // Dane graczy (chunked)
  getVACBanStatus(); // Statusy VAC (chunked)
```

#### `lib/leetify-helpers.ts`

```typescript
// Funkcje pomocnicze Leetify API
-isValidSteam64Id() - // Walidacja formatu
  getCachedLeetifyProfile() - // Cached profile fetch
  getCachedLeetifyMatches() - // Cached matches fetch
  calculateMatchStats() - // Obliczenia statystyk
  transformLeetifyData(); // Mapping do display format
```

#### `lib/theme-actions.ts`

```typescript
// Server Actions dla cookies
"use server" -
  getThemeFromCookies() -
  setThemeInCookies() -
  getGridSizeFromCookies() -
  setGridSizeInCookies() -
  getCompactViewFromCookies() -
  setCompactViewInCookies();
```

**Zalety:**

- ✅ Czyste API routes (tylko orchestration)
- ✅ Reusable logic
- ✅ Łatwe testowanie

---

### 4. **Strony (Server/Client Split)**

#### Home Page

```
page.tsx (Server)           → Pobiera cookies
  ↓
ThemeProvider              → Inicjalizuje motyw
  ↓
ProfileProvider            → Inicjalizuje pusty stan
  ↓
HomeClient (Client)        → Renderuje UI + search
```

#### Profile Page

```
page.tsx (Server)           → Pobiera cookies + steamid z params
  ↓
ThemeProvider              → Inicjalizuje motyw
  ↓
ProfileProvider            → Inicjalizuje pusty stan
  ↓
PageClient (Client)        → Fetchuje profil + renderuje
```

**Pattern:**

- Server Component = Initial data loading (SSR)
- Client Component = Interaktywność + state management

---

## 🔄 Przepływ danych

### Scenariusz 1: Wyszukiwanie profilu

```
1. User wpisuje Steam URL
   ↓
2. HomeClient.handleSearch()
   ↓
3. ProfileContext.fetchAndSetProfile()
   ↓
4. Sprawdzenie cache (Map)
   ├─ HIT → Zwróć z cache
   └─ MISS ↓
5. POST /api/steam
   ↓
6. Steam API Routes:
   - extractSteamId()
   - resolveVanityUrl() [cache: 1h]
   - getFriendList() [cache: 1h]
   - getPlayerSummaries() [cache: 1h]
   - getVACBanStatus() [cache: 1h]
   ↓
7. Response → ProfileContext
   ↓
8. Zapisz w cache (Map)
   ↓
9. Router.push(`/id/${steamId}`)
   ↓
10. PageClient renderuje profil
```

### Scenariusz 2: Zmiana motywu

```
1. User klika ThemeSelector
   ↓
2. ThemeContext.setTheme(newTheme)
   ↓
3. startTransition(() => {
     setTheme(newTheme)
     setThemeInCookies(newTheme)  // Server Action
   })
   ↓
4. Cookie zapisane (1 rok TTL)
   ↓
5. UI się aktualizuje (transition - płynnie)
```

---

## 📊 Analiza i rekomendacje

### ✅ CO DZIAŁA DOBRZE

#### 1. **Separation of Concerns**

```
✅ API Routes oddzielone od logiki biznesowej
✅ Helpers w osobnych plikach
✅ Server/Client Components dobrze rozdzielone
✅ Context dla globalnego stanu
```

#### 2. **Performance Optimizations**

```
✅ Next.js unstable_cache dla API
✅ In-memory cache w ProfileContext
✅ useMemo dla drogich obliczeń
✅ useCallback dla stabilnych funkcji
✅ React.memo na komponentach list
```

#### 3. **TypeScript**

```
✅ Wszystkie typy zdefiniowane
✅ Brak any
✅ Strict typing w całej aplikacji
```

#### 4. **UX**

```
✅ Loading states
✅ Error handling
✅ Zachowanie poprzednich danych przy błędzie
✅ Persystencja preferencji UI
```

---

### ⚠️ POTENCJALNE PROBLEMY

#### 1. **Cache w ProfileContext**

```typescript
// PROBLEM: Nieskończony wzrost cache
const profileCache = new Map<string, ApiResponseSteam>();

// REKOMENDACJA: LRU Cache z limitem
import LRU from "lru-cache";

const profileCache = new LRU<string, ApiResponseSteam>({
  max: 100, // max 100 profili
  ttl: 1000 * 60 * 30, // 30 min TTL
});
```

**Implementacja:**

```bash
npm install lru-cache
```

```typescript
import { LRUCache } from "lru-cache";

const profileCache = new LRUCache<string, ApiResponseSteam>({
  max: 100,
  ttl: 1000 * 60 * 30, // 30 minutes
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

// Użycie identyczne:
profileCache.set(key, value);
profileCache.get(key);
profileCache.has(key);
```

---

#### 2. **Brak Error Boundaries**

```typescript
// PROBLEM: Błędy w komponentach nie są łapane globalnie

// REKOMENDACJA: Dodać Error Boundary
// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button onClick={reset}>Try again</button>
      </div>
    </div>
  );
}
```

---

#### 3. **Brak Rate Limiting w API**

```typescript
// PROBLEM: API może być spamowane

// REKOMENDACJA: Rate limiting middleware
import rateLimit from "express-rate-limit";

// lib/rate-limit.ts
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minut
  max: 100, // max 100 requestów
});
```

**Lepsze rozwiązanie dla Next.js:**

```typescript
// lib/rate-limit.ts
import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number;
  uniqueTokenPerInterval: number;
};

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;

        return isRateLimited ? reject() : resolve();
      }),
  };
}

// Użycie w API route:
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minuta
  uniqueTokenPerInterval: 500,
});

export async function POST(request: NextRequest) {
  const ip = request.ip ?? "anonymous";

  try {
    await limiter.check(10, ip); // max 10 req/min
  } catch {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  // ... reszta logiki
}
```

---

#### 4. **Context Re-renders**

```typescript
// PROBLEM: Każda zmiana w ProfileContext powoduje re-render wszystkich konsumentów

// AKTUALNE:
const contextValue = {
  currentProfile,
  loading,
  error,
  fetchAndSetProfile,
  clearProfile,
  clearError,
};

// REKOMENDACJA: Split contexts lub useMemo
const contextValue = useMemo(
  () => ({
    currentProfile,
    loading,
    error,
    fetchAndSetProfile,
    clearProfile,
    clearError,
  }),
  [currentProfile, loading, error, fetchAndSetProfile, clearProfile, clearError]
);

// LUB split na dwa contexty:
// - ProfileDataContext (data only)
// - ProfileActionsContext (functions only)
```

**Lepsze podejście - Split contexts:**

```typescript
const ProfileDataContext = createContext<ProfileData | undefined>(undefined);
const ProfileActionsContext = createContext<ProfileActions | undefined>(
  undefined
);

export function ProfileProvider({ children }) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Actions nie zmieniają się
  const actions = useMemo(
    () => ({
      fetchAndSetProfile,
      clearProfile,
      clearError,
    }),
    [] // Pusta tablica - funkcje nigdy się nie zmieniają
  );

  // Data zmienia się często
  const data = useMemo(
    () => ({ currentProfile, loading, error }),
    [currentProfile, loading, error]
  );

  return (
    <ProfileActionsContext.Provider value={actions}>
      <ProfileDataContext.Provider value={data}>
        {children}
      </ProfileDataContext.Provider>
    </ProfileActionsContext.Provider>
  );
}

// Komponenty które tylko czytają dane:
export function useProfileData() {
  const context = useContext(ProfileDataContext);
  if (!context) throw new Error("...");
  return context;
}

// Komponenty które tylko wywołują akcje (nie re-renderują się!):
export function useProfileActions() {
  const context = useContext(ProfileActionsContext);
  if (!context) throw new Error("...");
  return context;
}
```

---

#### 5. **Brak Analytics/Monitoring**

```typescript
// REKOMENDACJA: Dodać monitoring błędów

// lib/logger.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error.message, context);

  // Opcjonalnie: Sentry, LogRocket, etc.
  // Sentry.captureException(error, { extra: context });
}

// Użycie w API:
try {
  // ...
} catch (error) {
  logError(error, { steamId, endpoint: '/api/steam' });
  return NextResponse.json(...);
}
```

---

#### 6. **Brak walidacji inputów**

```typescript
// PROBLEM: Brak walidacji requestów

// REKOMENDACJA: Zod schema validation

import { z } from "zod";

const SteamRequestSchema = z.object({
  profileUrl: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Walidacja
  const result = SteamRequestSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid input", details: result.error },
      { status: 400 }
    );
  }

  const { profileUrl } = result.data;
  // ...
}
```

---

#### 7. **Console.logs w production**

```typescript
// PROBLEM: console.log() w kodzie produkcyjnym

// components/profile/leetify-stats.tsx:22
console.log(themeConfig);

// components/profile/leetify-stats.tsx:41
console.log(data);

// app/id/[steamid]/page-client.tsx:38
console.log(currentProfile?.userProfile);

// REKOMENDACJA: Usunąć lub użyć conditional logging

// lib/logger.ts
export const isDev = process.env.NODE_ENV === "development";

export function devLog(...args: any[]) {
  if (isDev) {
    console.log(...args);
  }
}

// Użycie:
import { devLog } from "@/lib/logger";
devLog("Profile data:", currentProfile);
```

---

### 🎯 REKOMENDOWANE ZMIANY

#### 1. **Cache Management**

```typescript
// contexts/profile-context.tsx
import { LRUCache } from "lru-cache";

const profileCache = new LRUCache<string, ApiResponseSteam>({
  max: 100,
  ttl: 1000 * 60 * 30,
});
```

#### 2. **Context Optimization**

```typescript
// Split ProfileContext na data i actions
// Uniknie niepotrzebnych re-renders
```

#### 3. **Error Boundary**

```typescript
// app/error.tsx - globalny error boundary
// components/error-boundary.tsx - dla specific sections
```

#### 4. **Rate Limiting**

```typescript
// lib/rate-limit.ts
// Użyj w wszystkich API routes
```

#### 5. **Input Validation**

```typescript
// Zod schemas dla wszystkich API endpoints
```

#### 6. **Logging/Monitoring**

```typescript
// Conditional logging w development
// Error tracking w production (Sentry)
```

#### 7. **Clean up console.logs**

```typescript
// Usuń wszystkie console.log z komponentów
```

---

### 📈 PRZYSZŁE ULEPSZENIA (Nice-to-have)

#### 1. **State Management**

```typescript
// Rozważyć Zustand zamiast Context API dla lepszej performance
import create from "zustand";

const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  fetchProfile: async (id) => {
    set({ loading: true });
    // ...
  },
}));
```

#### 2. **React Query**

```typescript
// Lepsze cache management + auto-refetch
import { useQuery } from "@tanstack/react-query";

function useProfile(steamId: string) {
  return useQuery({
    queryKey: ["profile", steamId],
    queryFn: () => fetchProfile(steamId),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });
}
```

#### 3. **PWA Support**

```typescript
// Service Worker + offline support
// next-pwa plugin
```

#### 4. **Testing**

```typescript
// Unit tests (Vitest)
// E2E tests (Playwright)
// Component tests (Testing Library)
```

---

## 🏁 Podsumowanie

### ✅ MOCNE STRONY:

1. ✅ Dobra separacja odpowiedzialności
2. ✅ TypeScript + strict typing
3. ✅ Multi-level caching
4. ✅ SSR-friendly architecture
5. ✅ Clean helpers/utilities
6. ✅ Good UX (loading states, error handling)

### ⚠️ DO POPRAWY (KRYTYCZNE):

1. ❌ Cache bez limitów → **LRU Cache**
2. ❌ Brak rate limiting → **Dodać limity**
3. ❌ Console.logs w production → **Usunąć**
4. ❌ Brak input validation → **Zod schemas**
5. ❌ Context re-renders → **Split contexts lub useMemo**

### 🎯 DO POPRAWY (NICE-TO-HAVE):

1. ⚠️ Error Boundaries
2. ⚠️ Monitoring/Analytics
3. ⚠️ React Query zamiast ręcznego cache
4. ⚠️ Testing suite
5. ⚠️ PWA support

### 📝 WERDYKT:

**Aplikacja jest dobrze zaprojektowana i działa poprawnie**, ale ma kilka problemów z production-readiness (cache, rate limiting, logging). Po wdrożeniu rekomendowanych zmian będzie gotowa do produkcji.

**Priorytet działań:**

1. 🔴 HIGH: LRU Cache, Rate Limiting, Clean console.logs
2. 🟡 MEDIUM: Input validation, Error boundaries, Context optimization
3. 🟢 LOW: React Query, Testing, PWA
