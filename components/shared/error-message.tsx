"use client";

import { type ThemeConfig } from "@/contexts/theme-context";

interface ErrorMessageProps {
  message: string;
  themeConfig: ThemeConfig;
}

export function ErrorMessage({ message, themeConfig }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-3xl mb-6 mx-auto">
      <div
        className="border rounded-2xl p-4 backdrop-blur-md transition-all duration-500"
        style={{
          backgroundColor: `${themeConfig.accent}15`,
          borderColor: `${themeConfig.accent}80`,
        }}
      >
        <p
          className="text-center transition-colors duration-500"
          style={{ color: themeConfig.text }}
        >
          ⚠️ {message}
        </p>
      </div>
    </div>
  );
}
