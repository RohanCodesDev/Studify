"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export type MarksFormat = "oneMark" | "fiveMarks" | "fifteenMarks" | "crashRevision";

interface MarksTabItem {
  id: MarksFormat;
  label: string;
  subLabel: string;
}

interface MarksTabBarProps {
  activeFormat: MarksFormat;
  onChangeFormat: (format: MarksFormat) => void;
  className?: string;
}

const TABS: MarksTabItem[] = [
  { id: "oneMark", label: "1 Mark", subLabel: "Objective" },
  { id: "fiveMarks", label: "5 Marks", subLabel: "Short Note" },
  { id: "fifteenMarks", label: "15 Marks", subLabel: "Long Form" },
  { id: "crashRevision", label: "Crash", subLabel: "Night-Before" },
];

export default function MarksTabBar({
  activeFormat,
  onChangeFormat,
  className = "",
}: MarksTabBarProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <div
      className={`w-full p-1.5 rounded-2xl border backdrop-blur-md transition-colors duration-200 ${className}`}
      style={{
        backgroundColor: isDarkMode ? `${colors.cardBg}F0` : `${colors.cardBg}E6`,
        borderColor: colors.border,
      }}
    >
      <div className="grid grid-cols-4 gap-1 select-none">
        {TABS.map((tab) => {
          const isActive = activeFormat === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeFormat(tab.id)}
              className="relative py-2 px-1 rounded-xl flex flex-col items-center justify-center min-h-[44px] transition-colors duration-150 active:scale-[0.98]"
              style={{
                color: isActive ? colors.accentDark : colors.inkMuted,
              }}
            >
              {/* Sliding active pill background */}
              {isActive && (
                <motion.div
                  layoutId="readingMarksPill"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    backgroundColor: colors.accentSoft,
                    boxShadow: `0 2px 8px -2px ${colors.accent}40`,
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              <span className="relative z-10 text-xs sm:text-sm font-sans font-bold tracking-tight">
                {tab.label}
              </span>
              <span className="relative z-10 text-[9px] sm:text-[10px] font-body opacity-70 tracking-tight">
                {tab.subLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
