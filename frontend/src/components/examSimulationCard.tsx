"use client";

import React from "react";
import { Clock, FileText } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface ExamSimulationCardProps {
  onGeneratePaper?: () => void;
  className?: string;
}

export default function ExamSimulationCard({
  onGeneratePaper,
  className = "",
}: ExamSimulationCardProps) {
  const { colors } = useTheme();

  return (
    <div className={`space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span
          className="text-xs uppercase tracking-wider font-semibold opacity-70"
          style={{ color: colors.ink }}
        >
          Authentic Exam Simulation
        </span>
        <span
          className="text-xs font-body opacity-60"
          style={{ color: colors.inkMuted }}
        >
          70 Marks Blueprint
        </span>
      </div>

      <div
        className="p-5 rounded-3xl border shadow-sm transition-all flex flex-col gap-4"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              Official Layout
            </span>
            <span
              className="text-xs font-body opacity-65 flex items-center gap-1"
              style={{ color: colors.inkMuted }}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>3 Hours Timer</span>
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
            Semester Practice Question Paper
          </h2>
        </div>

        {/* 3 Compact Structure Badges */}
        <div className="grid grid-cols-3 gap-2 pt-0.5 text-center">
          <div
            className="p-2 rounded-xl border text-[11px] font-sans"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: `${colors.accent}4D`,
            }}
          >
            <span className="font-semibold block" style={{ color: colors.accentDark }}>
              Group A
            </span>
            <span className="opacity-70 font-body text-[10px] block mt-0.5">
              10 MCQs · 10m
            </span>
          </div>

          <div
            className="p-2 rounded-xl border text-[11px] font-sans"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: `${colors.accent}4D`,
            }}
          >
            <span className="font-semibold block" style={{ color: colors.accentDark }}>
              Group B
            </span>
            <span className="opacity-70 font-body text-[10px] block mt-0.5">
              3 of 5 · 15m
            </span>
          </div>

          <div
            className="p-2 rounded-xl border text-[11px] font-sans"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: `${colors.accent}4D`,
            }}
          >
            <span className="font-semibold block" style={{ color: colors.accentDark }}>
              Group C
            </span>
            <span className="opacity-70 font-body text-[10px] block mt-0.5">
              3 of 5 · 45m
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onGeneratePaper}
          className="w-full min-h-[44px] py-2.5 rounded-2xl text-xs sm:text-sm font-sans font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] border hover:opacity-90 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.accent,
            color: colors.accentDark,
          }}
        >
          <FileText className="w-4 h-4" />
          <span>Generate MAKAUT Paper</span>
        </button>
      </div>
    </div>
  );
}
