# 🎮 Who Went On Vacation

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Hono](https://img.shields.io/badge/Hono-4.x-orange?style=for-the-badge&logo=hono&logoColor=white)

**A modern Steam profile analyzer that tracks VAC bans and CS2 statistics across your friends list.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [API Reference](#-api-reference)

</div>

---

## 📋 Overview

**Who Went On Vacation** is a sleek web application that allows Counter-Strike players to analyze their Steam friends list for VAC bans, game bans, and view detailed CS2 statistics from Leetify. The name is a playful reference to the gaming community's euphemism for players who get banned.

### Why This Project?

- **Track Ban Status** - Monitor VAC, game, community, and trade bans across all friends
- **CS2 Statistics** - View Leetify ratings, FACEIT ELO, and Premier ranks
- **Beautiful UI** - Modern dark theme with smooth animations and responsive design
- **Fast & Efficient** - Optimized API calls with caching and parallel requests

---

## ✨ Features

### Steam Profile Analysis

- Search by Steam URL, vanity URL, or Steam64 ID
- Display user profile with avatar, username, and ban status
- Visual badges for different ban types (VAC, Game, Community, Trade)

### Friends List Scanner

- Fetch and display entire friends list
- Filter friends by ban status
- Sort by various criteria (name, bans, recent activity)
- Grid/List view toggle with adjustable card sizes
- Real-time search through friends

### Leetify Integration

- CS2 rating display with visual gauges
- FACEIT level and ELO tracking
- Premier rank display
- Recent match performance stats (K/D, HS%, Win Rate)
- Match history with opponent analysis

### User Experience

- Responsive design (mobile-first approach)
- Multiple theme options with persistent preferences
- Smooth Framer Motion animations
- Server-side rendered preferences via cookies
- Loading states and error handling

---

## 🛠 Tech Stack

### Frontend

| Technology         | Purpose                                             |
| ------------------ | --------------------------------------------------- |
| **Next.js 16**     | React framework with App Router & Server Components |
| **React 19**       | UI library with latest concurrent features          |
| **TypeScript**     | Type-safe development with strict mode              |
| **Tailwind CSS 4** | Utility-first styling with custom design system     |
| **Framer Motion**  | Declarative animations and gestures                 |
| **Radix UI**       | Accessible, unstyled component primitives           |

### Data & State

| Technology            | Purpose                              |
| --------------------- | ------------------------------------ |
| **TanStack Query v5** | Server state management with caching |
| **React Hook Form**   | Performant form handling             |
| **Zod**               | Runtime schema validation            |

### Backend

| Technology             | Purpose                              |
| ---------------------- | ------------------------------------ |
| **Hono**               | Lightweight, ultrafast API framework |
| **Next.js API Routes** | Serverless edge functions            |

### Development

| Technology | Purpose                                   |
| ---------- | ----------------------------------------- |
| **Bun**    | Fast JavaScript runtime & package manager |
| **ESLint** | Code linting and quality                  |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+
- Steam API Key ([Get one here](https://steamcommunity.com/dev/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fentashot/who-went-on-vacation.git
   cd who-went-on-vacation
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your Steam API key:

   ```env
   STEAM_API_KEY=your_steam_api_key_here
   LEETIFY_API_KEY=your_leetify_api_key_here
   ```

4. **Start the development server**

   ```bash
   bun dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
bun run build
bun start
```

---

## 🏗 Architecture

### Project Structure

```
steam-info-app/
├── app/                      # Next.js App Router
│   ├── api/v2/              # Hono API routes
│   │   └── [[...route]]/    # Catch-all route handler
│   ├── id/[steamid]/        # Dynamic profile pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── friends/             # Friends list components
│   ├── layout/              # Layout components (background, navigation)
│   ├── profile/             # Profile display components
│   ├── search/              # Search bar components
│   ├── shared/              # Reusable components
│   └── ui/                  # UI primitives (shadcn/ui)
├── contexts/                # React Context providers
│   ├── query-provider.tsx   # TanStack Query setup
│   └── theme-context.tsx    # Theme management
├── hooks/                   # Custom React hooks
│   ├── use-leetify-stats.ts # Leetify data fetching
│   └── use-steam-profile.ts # Steam profile fetching
├── lib/                     # Utility functions
│   ├── leetify-helpers.ts   # Leetify API helpers
│   ├── steam-helpers.ts     # Steam API helpers
│   └── utils.ts             # General utilities
├── types/                   # TypeScript type definitions
│   ├── cswatch.ts           # CSWatch types
│   ├── leetify.ts           # Leetify API types
│   └── steam.ts             # Steam API types (branded types)
└── public/                  # Static assets
```

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  React Components ←→ TanStack Query ←→ Custom Hooks             │
│         ↓                                    ↓                  │
│  Framer Motion              Zod Validation + Type Safety        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes (Hono)                    │
├─────────────────────────────────────────────────────────────────┤
│  POST /api/v2/steam    → Steam API (profiles, bans, friends)    │
│  POST /api/v2/leetify  → Leetify API (CS2 stats)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      External APIs                              │
├─────────────────────────────────────────────────────────────────┤
│  Steam Web API        │  Leetify Public API                     │
│  - GetPlayerSummaries │  - Profile data                         │
│  - GetFriendList      │  - Match statistics                     │
│  - GetPlayerBans      │  - FACEIT integration                   │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Branded Types for Steam IDs**
   - Uses TypeScript branded types (`Steam64ID`) for compile-time safety
   - Prevents mixing up different ID formats

2. **Server Components + Client Islands**
   - Pages use Server Components for initial data (theme preferences)
   - Interactive parts are Client Components with proper hydration

3. **Hono for API Routes**
   - Ultrafast routing with minimal overhead
   - Type-safe request/response handling
   - Easy middleware integration

4. **TanStack Query for Caching**
   - Automatic request deduplication
   - Background refetching
   - Optimistic updates support

---

## 📡 API Reference

### POST `/api/v2/steam`

Fetches Steam profile data including friends list and ban statuses.

**Request Body:**

```json
{
  "profileUrl": "https://steamcommunity.com/id/username"
}
```

**Response:**

```json
{
  "userProfile": {
    "steamid": "76561198...",
    "personaname": "Username",
    "avatarfull": "https://...",
    "VACBanned": false,
    "NumberOfVACBans": 0,
    "NumberOfGameBans": 0
  },
  "totalFriends": 150,
  "allFriends": [...],
  "bannedFriends": [...]
}
```

### POST `/api/v2/leetify`

Fetches Leetify statistics for a Steam user.

**Request Body:**

```json
{
  "steamId": "76561198..."
}
```

**Response:**

```json
{
  "leetify_rating": 1.05,
  "aim": 52.3,
  "positioning": 48.7,
  "utility": 45.2,
  "faceit": 8,
  "faceit_elo": 1856,
  "premier": 18500,
  "recent_matches": {...}
}
```

---

## 🔒 Environment Variables

| Variable          | Required | Description                            |
| ----------------- | -------- | -------------------------------------- |
| `STEAM_API_KEY`   |    ✅    | Steam Web API key for profile/ban data |
| `LEETIFY_API_KEY` |    ✅    | Leetify API key for CS2 stats data     |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**fentashot**

- GitHub: [@fentashot](https://github.com/fentashot)

---

<div align="center">

_"They're not banned, they're just on vacation."_

</div>
