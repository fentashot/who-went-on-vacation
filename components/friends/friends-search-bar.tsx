"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FriendsSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function FriendsSearchBar({ value, onChange }: FriendsSearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 z-10" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name..."
        className="h-12 bg-zinc-900/30 border-zinc-700/50 text-white placeholder:text-gray-500 backdrop-blur-md rounded-lg pl-10 border-2"
      />
    </div>
  );
}
