"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";

interface StudentStats {
  activeSessions: number;
  notesReady: number;
  quizAccuracy: number;
}

interface StudentProfileCardProps {
  name?: string;
  degree?: string;
  university?: string;
  semester?: string;
  stats?: StudentStats;
  className?: string;
}

const DEFAULT_STATS: StudentStats = {
  activeSessions: 2,
  notesReady: 14,
  quizAccuracy: 85,
};

export default function StudentProfileCard({
  name = "Student Workspace",
  degree = "B.Tech · Computer Science & Engineering (CSE)",
  university = "Maulana Abul Kalam Azad University of Technology (MAKAUT)",
  semester = "Sem 5",
  stats = DEFAULT_STATS,
  className = "",
}: StudentProfileCardProps) {
  const { colors } = useTheme();

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* ── Student Info Card ── */}
      <div
        className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex items-start gap-4"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-sans font-bold text-lg shrink-0 border"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
            color: colors.accentDark,
          }}
        >
          ST
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
              {name}
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              Active
            </span>
          </div>

          <p
            className="text-xs font-body leading-relaxed"
            style={{ color: colors.inkMuted }}
          >
            {degree}
          </p>
          <p
            className="text-[11px] font-body opacity-70"
            style={{ color: colors.inkMuted }}
          >
            {university} · {semester}
          </p>
        </div>
      </div>

      {/* ── Academic Stats Overview ── */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="p-3.5 rounded-2xl border text-center transition-colors"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <div
            className="text-base sm:text-lg font-sans font-bold"
            style={{ color: colors.accentDark }}
          >
            {stats.activeSessions}
          </div>
          <div className="text-[10px] font-body opacity-65">
            Active Sessions
          </div>
        </div>

        <div
          className="p-3.5 rounded-2xl border text-center transition-colors"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <div
            className="text-base sm:text-lg font-sans font-bold"
            style={{ color: colors.accentDark }}
          >
            {stats.notesReady}
          </div>
          <div className="text-[10px] font-body opacity-65">
            Notes Ready
          </div>
        </div>

        <div
          className="p-3.5 rounded-2xl border text-center transition-colors"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
          }}
        >
          <div
            className="text-base sm:text-lg font-sans font-bold"
            style={{ color: colors.accentDark }}
          >
            {stats.quizAccuracy}%
          </div>
          <div className="text-[10px] font-body opacity-65">
            Quiz Accuracy
          </div>
        </div>
      </div>
    </div>
  );
}
