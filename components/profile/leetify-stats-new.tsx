"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import type { LeetifyDisplayStats } from "@/types/leetify";

interface LeetifyStatsProps {
  steamId: string;
}

export function LeetifyStats({ steamId }: LeetifyStatsProps) {
  const [stats, setStats] = useState<LeetifyDisplayStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeetifyStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/leetify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ steamId }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to fetch Leetify stats");
        } else {
          setStats(data.stats);
        }
      } catch {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLeetifyStats();
  }, [steamId]);

  const leetifyUrl = `https://leetify.com/public/profile/${steamId}`;

  if (loading) {
    return (
      <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading Leetify stats...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900/30 border-zinc-800/50 border-1 hover:border-zinc-700/70 transition backdrop-blur-md overflow-hidden rounded-lg">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
          <p className="text-gray-400 mb-2">{error}</p>
          <a
            href={leetifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            View Leetify Profile →
          </a>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const firstSeen = stats.lastMatchAt ? new Date(stats.lastMatchAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const lastMatch = stats.lastMatchAt ? new Date(stats.lastMatchAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

  return (
    <Card className="bg-[#1a1a1a] border-zinc-800/50 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-emerald-500">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" />
          </svg>
          <h3 className="text-lg font-bold text-white">Leetify Statistics</h3>
        </div>

        <p className="text-sm text-gray-400 mb-4">Based on the last 30 Matches</p>

        {/* Badges */}
        <div className="flex gap-2 mb-6">
          <Badge variant="outline" className="bg-zinc-900/50 border-zinc-700 text-white text-xs px-3 py-1">
            FACEIT: {stats.faceit}
          </Badge>
          <Badge variant="outline" className="bg-zinc-900/50 border-zinc-700 text-white text-xs px-3 py-1">
            Premier: {stats.premier}
          </Badge>
          <Badge variant="outline" className="bg-zinc-900/50 border-zinc-700 text-white text-xs px-3 py-1">
            Competitive: {stats.competitive}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
          {/* Left side - Rating and Skills */}
          <div className="flex flex-col gap-6">
            {/* Rating Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#27272a"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - stats.rating / 10)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">+{stats.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-400">Leetify Rating</p>
            </div>

            {/* Skills */}
            <div className="space-y-3 min-w-[280px]">
              {stats.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-300">{skill.name}</span>
                    <span className="text-sm font-semibold text-white">{skill.value}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-3">
            {/* Top row - 4 stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">K/D</p>
                <p className="text-3xl font-bold text-white">{stats.kd}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Head Accuracy</p>
                <p className="text-3xl font-bold text-white">{stats.headAccuracy}%</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Winrate</p>
                <p className="text-3xl font-bold text-white">{stats.winrate}%</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Total Matches</p>
                <p className="text-3xl font-bold text-white">{stats.matches}</p>
              </div>
            </div>

            {/* Middle row - 2 stats + W/L History */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr] gap-3">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Kills per Round</p>
                <p className="text-3xl font-bold text-white">{stats.killsPerRound}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Spotted Accuracy *</p>
                <p className="text-3xl font-bold text-white">{stats.spottedAccuracy}%</p>
              </div>
              {stats.winHistory.length > 0 && (
                <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                  <p className="text-xs text-gray-400 mb-2">W/L History</p>
                  <div className="flex gap-1 flex-wrap">
                    {stats.winHistory.map((result, index) => (
                      <div
                        key={index}
                        className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold ${result === "W"
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                          }`}
                      >
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom row - 2 stats + striped area */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_2fr] gap-3">
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Time to Damage</p>
                <p className="text-3xl font-bold text-white">{stats.timeToDamage}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
                <p className="text-xs text-gray-400 mb-1">Spray Accuracy</p>
                <p className="text-3xl font-bold text-white">{stats.sprayAccuracy}%</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4 border border-zinc-800 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]">
                {/* Striped placeholder */}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 text-xs text-gray-500">
          <span>First seen: {firstSeen}</span>
          <span>Last Match: {lastMatch}</span>
        </div>
      </CardContent>
    </Card>
  );
}
