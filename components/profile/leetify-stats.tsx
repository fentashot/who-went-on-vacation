"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Loader2 } from "lucide-react";

interface LeetifyStatsProps {
  steamId: string;
}

interface LeetifyData {
  rating: string | null;
  matches: number | null;
  faceit: number | null;
  premier: number | null;
  competitive: number | null;
  kd: number | null;
  headAccuracy: number | null;
  winrate: number | null;
  killsPerRound: number | null;
  spottedAccuracy: number | null;
  timeToDamage: string | null;
  sprayAccuracy: number | null;
  skills: Array<{ name: string; value: number; color: string }>;
  winHistory: string[];
}

export function LeetifyStats({ steamId }: LeetifyStatsProps) {
  const [stats, setStats] = useState<LeetifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeetifyStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cswatch", {
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
      } catch (err) {
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchLeetifyStats();
  }, [steamId]);

  const leetifyUrl = `https://leetify.com/public/profile/${steamId}`;

  // Mock data jako fallback
  const mockStats: LeetifyData = {
    rating: "0",
    matches: 154,
    faceit: 1,
    premier: 6,
    competitive: 23,
    kd: 1.7,
    headAccuracy: 21.0,
    winrate: 57,
    killsPerRound: 1.06,
    spottedAccuracy: 38.3,
    timeToDamage: "553ms",
    sprayAccuracy: 41.9,
    skills: [
      { name: "Aim", value: 91, color: "bg-emerald-500" },
      { name: "Utility", value: 73, color: "bg-emerald-500" },
      { name: "Positioning", value: 69, color: "bg-emerald-500" },
      { name: "Opening Duels", value: 4, color: "bg-emerald-500" },
      { name: "Clutching", value: 15, color: "bg-emerald-500" },
    ],
    winHistory: ["W", "L", "W", "W", "L", "W", "W", "W", "L", "L"],
  };

  const displayStats = stats || mockStats;

  if (loading) {
    return (
      <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden">
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          <span className="ml-3 text-gray-400">Loading Leetify stats...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Leetify Statistics
              </h3>
              <p className="text-xs text-gray-400">
                Based on the last 30 Matches
              </p>
            </div>
          </div>
          <a
            href={leetifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pink-400 hover:text-pink-300 transition-colors"
          >
            View Full Profile →
          </a>
        </div>

        {/* Match Types */}
        <div className="flex gap-2 mb-6">
          <Badge
            variant="outline"
            className="bg-black/10 border-zinc-700/50 text-white"
          >
            FACEIT: {displayStats.faceit}
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/10 border-zinc-700/50 text-white"
          >
            Premier: {displayStats.premier}
          </Badge>
          <Badge
            variant="outline"
            className="bg-black/10 border-zinc-700/50 text-white"
          >
            Competitive: {displayStats.competitive}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Skills & Rating */}
          <div>
            {/* Leetify Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                  <span className="text-xl font-bold text-emerald-400">
                    {displayStats.rating}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Leetify Rating</p>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              {displayStats.skills.map((skill) => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-300">{skill.name}</span>
                    <span className="text-sm font-semibold text-white">
                      {skill.value}
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-500`}
                      style={{ width: `${skill.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-4">
            {/* Top Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">K/D</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.kd}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Head Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.headAccuracy}%
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Winrate</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.winrate}%
                </p>
              </div>
            </div>

            {/* Middle Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Kills per Round</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.killsPerRound}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Spotted Accuracy *</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.spottedAccuracy}%
                </p>
              </div>
            </div>

            {/* Bottom Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Time to Damage</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.timeToDamage}
                </p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Spray Accuracy</p>
                <p className="text-2xl font-bold text-white">
                  {displayStats.sprayAccuracy}%
                </p>
              </div>
            </div>

            {/* W/L History */}
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-2">W/L History</p>
              <div className="flex gap-1">
                {displayStats.winHistory.map((result, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
                      result === "W"
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Matches */}
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Total Matches</p>
              <p className="text-2xl font-bold text-white">
                {displayStats.matches}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
