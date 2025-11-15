'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2Icon, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { type ThemeConfig } from '@/components/theme-selector';

interface SteamSearchBarProps {
  onSearch: (profileUrl: string) => void;
  loading?: boolean;
  themeConfig: ThemeConfig;
  showHeader?: boolean;
  showExamples?: boolean;
  headerTransition?: boolean;
  placeholder?: string;
}

const BADGE_EXAMPLES = ['76561198012345678', 'https://steamcommunity.com/id/username', 'username'];
const BADGE_CLASS = 'bg-zinc-900/20 hover:bg-zinc-800/30 text-gray-300 border-zinc-700/50 text-xs';

// Extract Steam ID from profile URL
function extractSteamId(input: string): string {
  const cleanInput = input.trim();

  // If it's already a Steam ID (64-bit)
  if (/^\d{17}$/.test(cleanInput)) {
    return cleanInput;
  }

  // Extract from URL patterns
  const patterns = [
    /steamcommunity\.com\/profiles\/(\d{17})/,
    /steamcommunity\.com\/id\/([^\/\?]+)/,
  ];

  for (const pattern of patterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // If no pattern matched, treat as vanity URL (custom ID)
  // Remove any leading slashes, dots, or trailing slashes/queries
  const vanityUrl = cleanInput
    .replace(/^[\.\/]+/, '')
    .replace(/[\/\?].*$/, '');

  // If it looks like a simple username/ID (no special chars except underscore/hyphen)
  if (/^[a-zA-Z0-9_-]+$/.test(vanityUrl)) {
    return vanityUrl;
  }

  return cleanInput;
}

export function SteamSearchBar({
  onSearch,
  loading = false,
  themeConfig,
  showHeader = true,
  showExamples = true,
  headerTransition = false,
  placeholder
}: SteamSearchBarProps) {
  const [profileUrl, setProfileUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileUrl.trim()) {
      const extractedId = extractSteamId(profileUrl);
      onSearch(extractedId);
    }
  };

  return (
    <div className={`w-full flex flex-col items-center transition-all duration-700 ${headerTransition ? 'mt-0' : ''}`}>
      {showHeader && (
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Eye className="w-10 h-10 transition-colors duration-700" style={{ color: themeConfig.text }} />
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="transition-colors duration-700" style={{ color: themeConfig.text }}>One search,</span>{' '}
              <span className="text-white">
                all bans
                <span className="inline-block w-8 text-left">
                  <span className={loading ? "animate-blink-dots" : "opacity-0"}>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </span>
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Steam VAC Ban Checker</p>
        </div>
      )}

      <div className="w-full max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-14">
          <div className="flex relative">
            <motion.div
              className="absolute left-6 -top-7 text-4xl z-20 pointer-events-none"
              animate={{
                y: [0, -10, 0],
                rotate: [-5, 5, -5],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              😎
            </motion.div>
            <input
              type="text"
              value={profileUrl}
              onChange={(e) => setProfileUrl(e.target.value)}
              placeholder={".../id/" + placeholder || "Enter Steam profile URL or ID..."}
              className="w-full border-r-0 h-14 bg-zinc-900/30 border-2 pl-10 pr-8 focus:ring-0 focus:outline-none border-zinc-700/50 text-white placeholder:text-gray-500 text-md backdrop-blur-md rounded-2xl rounded-e-none transition-all duration-500"
              disabled={loading}
              required
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-14 text-white rounded-xl transition-all duration-500 rounded-l-none z-10 border-2 border-l-0"
              style={{ backgroundColor: themeConfig.accent, borderColor: themeConfig.border }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = themeConfig.accentHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = themeConfig.accent}
            >
              {loading ? <Loader2Icon className="min-w-12 min-h-6 animate-spin" /> : <Search className="min-w-12 min-h-6" />}
            </Button>
          </div>

          {showExamples && (
            <div className={`text-center ${loading ? 'hidden' : ''}`}>
              <p className="text-xs text-gray-500 mb-3 mt-6">Supported formats</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {BADGE_EXAMPLES.map(text => (
                  <Badge key={text} variant="secondary" className={BADGE_CLASS}>{text}</Badge>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
