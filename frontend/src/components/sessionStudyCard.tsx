"use client";

import React from "react";
import { Plus, ArrowRight, Clock } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// ─── Tweakable layout config ───────────────────────────────────────────────
export const SESSION_STUDY_CONFIG = {
  cardPadding: "p-5 sm:p-6",
  cardRadius: "rounded-3xl",
  innerCardRadius: "rounded-2xl",
  buttonRadius: "rounded-2xl",
  buttonMinHeight: "46px",
};

export interface PrevSessionData {
  id: string;
  subjectCode: string;
  subjectName: string;
  currentChapter: string;
  progressPercent: number;
  topicsCovered: number;
  totalTopics: number;
  lastActive?: string;
}

interface SessionStudyCardProps {
  prevSession?: PrevSessionData | null;
  onStartNewSession?: () => void;
  onResumeSession?: (sessionId: string) => void;
  className?: string;
}

export default function SessionStudyCard({
  prevSession,
  onStartNewSession,
  onResumeSession,
  className = "",
}: SessionStudyCardProps) {
  const { colors, isDarkMode } = useTheme();

  const handleStart = () => {
    if (onStartNewSession) {
      onStartNewSession();
    } else {
      console.log("Start new session triggered");
    }
  };

  const handleResume = (id: string) => {
    if (onResumeSession) {
      onResumeSession(id);
    } else {
      console.log("Resume session triggered:", id);
    }
  };

  return (
    <div
      className={`w-full ${SESSION_STUDY_CONFIG.cardRadius} border shadow-sm transition-all duration-300 ${SESSION_STUDY_CONFIG.cardPadding} ${className}`}
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
        color: colors.ink,
      }}
    >
      {/* ── Card Header (Clean: Title only, no meta badges or redundant filler) ── */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">
          Session Study
        </h2>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* ── 1. Continue Previous Session (if any) ── */}
        {prevSession && (
          <div
            className={`w-full p-4 sm:p-5 ${SESSION_STUDY_CONFIG.innerCardRadius} border flex flex-col gap-3 transition-all`}
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[11px] uppercase tracking-wider font-semibold font-sans opacity-70 flex items-center gap-1.5"
                style={{ color: colors.ink }}
              >
                <Clock className="w-3.5 h-3.5" style={{ color: colors.accentDark }} />
                <span>Current Session</span>
              </span>
              <span
                className="text-xs font-semibold font-sans px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: colors.cardBg,
                  color: colors.accentDark,
                }}
              >
                {prevSession.progressPercent}% Ready
              </span>
            </div>

            {/* Subject and Chapter Details */}
            <div className="space-y-0.5">
              <div
                className="text-sm sm:text-base font-sans font-bold truncate"
                style={{ color: colors.ink }}
              >
                {prevSession.subjectCode} · {prevSession.subjectName}
              </div>
              <div
                className="text-xs font-body opacity-75 truncate"
                style={{ color: colors.inkMuted }}
              >
                {prevSession.currentChapter}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1 pt-1">
              <div
                className="w-full h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: `${colors.accent}4D` }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, Math.max(0, prevSession.progressPercent))}%`,
                    backgroundColor: colors.accentDark,
                  }}
                />
              </div>
              <div
                className="flex items-center justify-between text-[11px] font-body opacity-70"
                style={{ color: colors.inkMuted }}
              >
                <span>
                  {prevSession.topicsCovered} of {prevSession.totalTopics} topics ready
                </span>
                {prevSession.lastActive && <span>{prevSession.lastActive}</span>}
              </div>
            </div>

            {/* Resume button */}
            <button
              type="button"
              onClick={() => handleResume(prevSession.id)}
              className={`
                w-full ${SESSION_STUDY_CONFIG.buttonRadius}
                font-sans font-semibold text-xs sm:text-sm
                flex items-center justify-center gap-2 mt-1
                transition-all duration-200 active:scale-[0.98] shadow-sm
              `}
              style={{
                minHeight: SESSION_STUDY_CONFIG.buttonMinHeight,
                backgroundColor: colors.accentDark,
                color: "#FFFFFF",
                boxShadow: `0 4px 14px ${colors.accent}66`,
              }}
            >
              <span>Resume Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── 2. Start New Session Section ── */}
        <div
          className={`w-full p-4 sm:p-5 ${SESSION_STUDY_CONFIG.innerCardRadius} border flex flex-col gap-3 transition-colors`}
          style={{
            backgroundColor: isDarkMode ? "#1C1F24" : "#FFFFFF",
            borderColor: colors.border,
          }}
        >
          <div className="space-y-0.5">
            <h3 className="text-sm sm:text-base font-sans font-semibold">
              Start a New Course Session
            </h3>
            <p
              className="text-xs font-body leading-relaxed"
              style={{ color: colors.inkMuted }}
            >
              Generate chapter-by-chapter notes for your MAKAUT subjects.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStart}
            className={`
              w-full ${SESSION_STUDY_CONFIG.buttonRadius}
              font-sans font-semibold text-xs sm:text-sm
              flex items-center justify-center gap-2 border
              transition-all duration-200 active:scale-[0.98]
            `}
            style={{
              minHeight: SESSION_STUDY_CONFIG.buttonMinHeight,
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
            <Plus className="w-4 h-4" />
            <span>Create New Study Session</span>
          </button>
        </div>
      </div>
    </div>
  );
}
