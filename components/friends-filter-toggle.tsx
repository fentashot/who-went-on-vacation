'use client';

import { Eye, Users } from 'lucide-react';

interface ThemeConfig {
  text: string;
  accent: string;
  gradient: {
    from: string;
    via: string;
    to: string;
  };
  gridColor: string;
}

interface FriendsFilterToggleProps {
  showOnlyBanned: boolean;
  onToggle: (showOnlyBanned: boolean) => void;
  totalFriends: number;
  bannedCount: number;
  themeConfig: ThemeConfig;
}

const INACTIVE_STYLES = {
  backgroundColor: '#00000010',
  borderColor: '#3f3f46',
  color: '#a1a1aa',
};

const HOVER_STYLES = {
  backgroundColor: '#00000020',
  color: '#d4d4d8',
  borderColor: '#52525b',
};

export function FriendsFilterToggle({
  showOnlyBanned,
  onToggle,
  totalFriends,
  bannedCount,
  themeConfig,
}: FriendsFilterToggleProps) {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
    if (!isActive) {
      Object.assign(e.currentTarget.style, HOVER_STYLES);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>, isActive: boolean) => {
    if (!isActive) {
      Object.assign(e.currentTarget.style, INACTIVE_STYLES);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 flex-wrap">
      {/* Total Friends Button */}
      <button
        onClick={() => onToggle(false)}
        className="px-4 py-2 backdrop-blur w-52 text-sm transition-all duration-300 border rounded-lg flex items-center justify-center"
        style={
          !showOnlyBanned
            ? { backgroundColor: '#52525b80', borderColor: '#52525b', color: 'white' }
            : INACTIVE_STYLES
        }
        onMouseEnter={(e) => handleMouseEnter(e, !showOnlyBanned)}
        onMouseLeave={(e) => handleMouseLeave(e, !showOnlyBanned)}
      >
        <Users className="mr-1" size={22} />
        Total friends: <span className="font-bold ml-1">{totalFriends}</span>
      </button>

      {/* With Bans Button */}
      <button
        onClick={() => onToggle(true)}
        className="px-4 py-2 backdrop-blur-sm w-52 text-sm transition-all duration-300 border rounded-lg flex items-center justify-center"
        style={
          showOnlyBanned
            ? {
              backgroundColor: `${themeConfig.accent}20`,
              borderColor: themeConfig.accent,
              color: themeConfig.text,
            }
            : INACTIVE_STYLES
        }
        onMouseEnter={(e) => handleMouseEnter(e, showOnlyBanned)}
        onMouseLeave={(e) => handleMouseLeave(e, showOnlyBanned)}
      >
        <Eye className="mr-1" size={22} />
        With bans: <span className="font-bold ml-1">{bannedCount}</span>
      </button>
    </div>
  );
}
