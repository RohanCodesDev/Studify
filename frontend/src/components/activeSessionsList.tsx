"use client";

import React from "react";
import { BookOpen, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export interface SessionItem {
  id: string;
  code: string;
  name: string;
  semester: string;
  chapter: string;
  progressPercent: number;
  topicsReady: number;
  totalTopics: number;
  lastStudied: string;
}

interface ActiveSessionsListProps {
  sessions: SessionItem[];
  onContinueChapter?: (id: string) => void;
  onAddSubject?: () => void;
  className?: string;
}

export default function ActiveSessionsList({
  sessions,
  onContinueChapter,
  onAddSubject,
  className = "",
}: ActiveSessionsListProps) {
  const { colors, isDarkMode } = useTheme();

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* ── Active Session Cards ── */}
      <div className="space-y-3.5">
        {sessions.map((sess) => (
          <div
            key={sess.id}
            className="p-5 rounded-3xl border shadow-sm transition-all flex flex-col gap-3.5"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                    style={{
                      backgroundColor: colors.accentSoft,
                      color: colors.accentDark,
                    }}
                  >
                    {sess.code}
                  </span>
                  <span
                    className="text-xs font-body opacity-60"
                    style={{ color: colors.inkMuted }}
                  >
                    {sess.semester}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight mt-1">
                  {sess.name}
                </h2>
                <p
                  className="text-xs font-body opacity-80"
                  style={{ color: colors.inkMuted }}
                >
                  {sess.chapter}
                </p>
              </div>

              <span
                className="px-2.5 py-1 rounded-full text-xs font-sans font-semibold shrink-0"
                style={{
                  backgroundColor: colors.accentSoft,
                  color: colors.accentDark,
                }}
              >
                {sess.progressPercent}%
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${colors.accent}33` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${sess.progressPercent}%`,
                    backgroundColor: colors.accentDark,
                  }}
                />
              </div>
              <div
                className="flex items-center justify-between text-[11px] font-body opacity-65"
                style={{ color: colors.inkMuted }}
              >
                <span>
                  {sess.topicsReady} of {sess.totalTopics} topics mastered
                </span>
                <span>{sess.lastStudied}</span>
              </div>
            </div>

            {/* Continue Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onContinueChapter?.(sess.id)}
                className="w-full min-h-[44px] py-2.5 rounded-2xl text-xs sm:text-sm font-sans font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] border"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.accent,
                  color: colors.accentDark,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.accentSoft;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.cardBg;
                }}
              >
                <span>Continue Chapter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add another subject prompt ── */}
      <div
        onClick={onAddSubject}
        role="button"
        tabIndex={0}
        aria-label="Add another subject"
        className="p-5 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none active:scale-[0.99]"
        style={{
          backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
          borderColor: colors.border,
        }}
      >
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: colors.accentSoft,
            color: colors.accentDark,
          }}
        >
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-sm font-sans font-semibold">
            Add another subject
          </h3>
          <p
            className="text-xs font-body opacity-70"
            style={{ color: colors.inkMuted }}
          >
            Choose from CSE, IT, ECE syllabus catalogues.
          </p>
        </div>
      </div>
    </div>
  );
}
