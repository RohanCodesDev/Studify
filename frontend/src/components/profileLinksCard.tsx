"use client";

import React from "react";
import { useRouter } from "next/router";
import { Sparkles, GraduationCap, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ProfileLinksCardProps {
  className?: string;
}

export default function ProfileLinksCard({
  className = "",
}: ProfileLinksCardProps) {
  const router = useRouter();
  const { colors, activeProfile, isDarkMode } = useTheme();

  return (
    <div
      className={`rounded-3xl border overflow-hidden transition-colors ${className}`}
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
      }}
    >
      <button
        type="button"
        onClick={() => router.push("/settings")}
        className="w-full min-h-[50px] p-4 flex items-center justify-between border-b transition-colors text-left active:scale-[0.99]"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.accentSoft,
              color: colors.accentDark,
            }}
          >
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-sans font-semibold">
              Appearance &amp; Colour Palette
            </div>
            <div
              className="text-[11px] font-body opacity-65"
              style={{ color: colors.inkMuted }}
            >
              Active: {activeProfile.name} ({isDarkMode ? "Dark" : "Light"})
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 opacity-40" />
      </button>

      <button
        type="button"
        onClick={() => router.push("/tools")}
        className="w-full min-h-[50px] p-4 flex items-center justify-between transition-colors text-left active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.accentSoft,
              color: colors.accentDark,
            }}
          >
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-sans font-semibold">
              Academic Calculators
            </div>
            <div
              className="text-[11px] font-body opacity-65"
              style={{ color: colors.inkMuted }}
            >
              SGPA / CGPA and 75% Attendance planner
            </div>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 opacity-40" />
      </button>
    </div>
  );
}
