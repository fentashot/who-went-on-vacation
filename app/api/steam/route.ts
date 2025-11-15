import { NextRequest, NextResponse } from 'next/server';

const STEAM_API_KEY = process.env.STEAM_API_KEY;

interface SteamPlayer {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
}

interface VACBanInfo {
  SteamId: string;
  CommunityBanned: boolean;
  VACBanned: boolean;
  NumberOfVACBans: number;
  DaysSinceLastBan: number;
  NumberOfGameBans: number;
  EconomyBan: string;
}

interface SteamFriend {
  steamid: string;
  relationship: string;
  friend_since: number;
}

// Extract Steam ID from profile URL
function extractSteamId(input: string): string | null {
  // Clean input - remove whitespace
  const cleanInput = input.trim();

  // If it's already a Steam ID (64-bit)
  if (/^\d{17}$/.test(cleanInput)) {
    return cleanInput;
  }

  // Extract from URL patterns
  const patterns = [
    /steamcommunity\.com\/profiles\/(\d{17})/,
    /steamcommunity\.com\/id\/([^\/]+)/,
  ];

  for (const pattern of patterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matched, treat as vanity URL (custom ID)
  // Remove any leading slashes or dots
  const vanityUrl = cleanInput.replace(/^[\.\/]+/, '');

  // If it looks like a simple username/ID (no special chars except underscore/hyphen)
  if (/^[a-zA-Z0-9_-]+$/.test(vanityUrl)) {
    return vanityUrl;
  }

  return null;
}

// Resolve vanity URL to Steam ID
async function resolveVanityUrl(vanityUrl: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`
    );

    if (!response.ok) {
      console.error('Steam API error:', response.status, response.statusText);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Steam API returned non-JSON response. Check if your API key is valid.');
      throw new Error('Invalid Steam API key or API error. Please check your STEAM_API_KEY in .env.local');
    }

    const data = await response.json();

    if (data.response?.success === 1) {
      return data.response.steamid;
    }
    return null;
  } catch (error) {
    console.error('Error resolving vanity URL:', error);
    throw error;
  }
}

// Get user's friend list
async function getFriendList(steamId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetFriendList/v1/?key=${STEAM_API_KEY}&steamid=${steamId}&relationship=friend`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch friend list. Profile might be private.');
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid Steam API key or API error. Please check your STEAM_API_KEY in .env.local');
    }

    const data = await response.json();
    return data.friendslist?.friends?.map((friend: SteamFriend) => friend.steamid) || [];
  } catch (error) {
    throw error;
  }
}

// Get player summaries
async function getPlayerSummaries(steamIds: string[]): Promise<SteamPlayer[]> {
  try {
    // Steam API allows up to 100 IDs at once
    const chunks = [];
    for (let i = 0; i < steamIds.length; i += 100) {
      chunks.push(steamIds.slice(i, i + 100));
    }

    const allPlayers: SteamPlayer[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${STEAM_API_KEY}&steamids=${chunk.join(',')}`
      );
      const data = await response.json();
      allPlayers.push(...(data.response?.players || []));
    }

    return allPlayers;
  } catch (error) {
    console.error('Error fetching player summaries:', error);
    return [];
  }
}

// Get VAC ban status
async function getVACBanStatus(steamIds: string[]): Promise<VACBanInfo[]> {
  try {
    // Steam API allows up to 100 IDs at once
    const chunks = [];
    for (let i = 0; i < steamIds.length; i += 100) {
      chunks.push(steamIds.slice(i, i + 100));
    }

    const allBanInfo: VACBanInfo[] = [];

    for (const chunk of chunks) {
      const response = await fetch(
        `https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=${STEAM_API_KEY}&steamids=${chunk.join(',')}`
      );
      const data = await response.json();
      allBanInfo.push(...(data.players || []));
    }

    return allBanInfo;
  } catch (error) {
    console.error('Error fetching VAC ban status:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!STEAM_API_KEY) {
      return NextResponse.json(
        { error: 'Steam API key not configured. Please add STEAM_API_KEY to your .env.local file. Get your key from: https://steamcommunity.com/dev/apikey' },
        { status: 500 }
      );
    }

    if (STEAM_API_KEY === 'your_steam_api_key_here') {
      return NextResponse.json(
        { error: 'Please replace the placeholder STEAM_API_KEY in .env.local with your actual Steam API key from: https://steamcommunity.com/dev/apikey' },
        { status: 500 }
      );
    }

    const { profileUrl } = await request.json();

    if (!profileUrl) {
      return NextResponse.json(
        { error: 'Profile URL is required' },
        { status: 400 }
      );
    }

    // Extract Steam ID from URL
    let steamId = extractSteamId(profileUrl);

    // If it's a vanity URL, resolve it
    if (steamId && !/^\d{17}$/.test(steamId)) {
      steamId = await resolveVanityUrl(steamId);
    }

    if (!steamId) {
      return NextResponse.json(
        { error: 'Invalid Steam profile URL' },
        { status: 400 }
      );
    }

    // Get user profile data
    const userProfile = await getPlayerSummaries([steamId]);
    const userBanStatus = await getVACBanStatus([steamId]);

    const userData = {
      ...userProfile[0],
      ...userBanStatus[0],
    };

    // Get friend list
    const friendIds = await getFriendList(steamId);

    if (friendIds.length === 0) {
      return NextResponse.json({
        message: 'No friends found or profile is private',
        userProfile: userData,
        bannedFriends: [],
      });
    }

    // Get VAC ban status for all friends
    const banStatuses = await getVACBanStatus(friendIds);

    // Filter friends with VAC bans
    const bannedFriendIds = banStatuses
      .filter(ban => ban.VACBanned || ban.NumberOfGameBans > 0)
      .map(ban => ban.SteamId);

    if (bannedFriendIds.length === 0) {
      return NextResponse.json({
        message: 'No friends with VAC bans found',
        userProfile: userData,
        totalFriends: friendIds.length,
        bannedFriends: [],
      });
    }

    // Get player summaries for banned friends
    const bannedPlayers = await getPlayerSummaries(bannedFriendIds);

    // Combine player info with ban info
    const bannedFriends = bannedPlayers.map(player => {
      const banInfo = banStatuses.find(ban => ban.SteamId === player.steamid);
      return {
        ...player,
        ...banInfo,
      };
    });

    return NextResponse.json({
      message: `Found ${bannedFriends.length} friend(s) with VAC/Game bans`,
      userProfile: userData,
      totalFriends: friendIds.length,
      bannedFriends,
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
