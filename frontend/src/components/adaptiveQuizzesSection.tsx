"use client";

import React from "react";
import { ArrowRight, Lock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AdaptiveQuizzesSectionProps {
  onStartQuiz?: (quizId: string) => void;
  className?: string;
}

export default function AdaptiveQuizzesSection({
  onStartQuiz,
  className = "",
}: AdaptiveQuizzesSectionProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <div className={`space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-wider font-semibold opacity-70"
          style={{ color: colors.ink }}
        >
          Adaptive Quizzes
        </span>
        <span
          className="text-xs font-body opacity-60"
          style={{ color: colors.inkMuted }}
        >
          Spaced Repetition (SM-2)
        </span>
      </div>

      {/* Ready / Unlocked Quiz Card */}
      <div
        className="p-5 rounded-3xl border shadow-sm transition-all flex flex-col gap-3.5"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              PCC-CS501 · DBMS
            </span>
            <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight mt-1">
              Module 3: Normalization Drill
            </h2>
            <p
              className="text-xs font-body opacity-75"
              style={{ color: colors.inkMuted }}
            >
              10 Concept MCQs · 1-Mark MAKAUT Group A style
            </p>
          </div>

          <span
            className="px-2.5 py-1 rounded-full text-xs font-sans font-semibold shrink-0"
            style={{
              backgroundColor: colors.accentSoft,
              color: colors.accentDark,
            }}
          >
            Unlocked
          </span>
        </div>

        <button
          type="button"
          onClick={() => onStartQuiz?.("quiz_dbms_m3")}
          className="w-full min-h-[44px] py-2.5 rounded-2xl text-xs sm:text-sm font-sans font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
          style={{
            backgroundColor: colors.accentDark,
            color: "#FFFFFF",
            boxShadow: `0 4px 14px ${colors.accent}55`,
          }}
        >
          <span>Start Adaptive Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Locked Quiz Card (Calm soft-lock) */}
      <div
        className="p-4 sm:p-5 rounded-3xl border transition-colors flex items-center justify-between gap-3 opacity-75"
        style={{
          backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
          borderColor: colors.border,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.inkMuted,
            }}
          >
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-sans font-semibold">
              Operating Systems · Process Scheduling
            </div>
            <div
              className="text-[11px] font-body"
              style={{ color: colors.inkMuted }}
            >
              Finish Chapter 2 notes to unlock quiz
            </div>
          </div>
        </div>

        <span
          className="text-xs font-sans font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: colors.cardBg,
            color: colors.inkMuted,
          }}
        >
          Locked
        </span>
      </div>
    </div>
  );
}
