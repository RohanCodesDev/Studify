import Head from "next/head";
import { useState } from "react";
import { GraduationCap, CheckCircle2, Lock, ArrowRight, Clock, HelpCircle, FileText, Sparkles } from "lucide-react";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function PracticePage() {
  const { colors, isDarkMode } = useTheme();

  return (
    <>
      <Head>
        <title>Practice Arena · Studify</title>
        <meta
          name="description"
          content="Adaptive quizzes and authentic MAKAUT exam papers with timer simulation."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col overflow-x-hidden transition-colors duration-300 font-sans"
        style={{ backgroundColor: colors.pageBg, color: colors.ink }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          {/* ── Page Header ── */}
          <header className="px-4 sm:px-6 py-5 sm:py-6">
            <span
              className="text-xs font-body tracking-wide"
              style={{ color: colors.inkMuted }}
            >
              Exam Readiness &amp; Drills
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
              Practice Arena
            </h1>
          </header>

          {/* ── Main Content Container ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-6 pb-36">
            {/* Section 1: Adaptive Chapter Quizzes */}
            <div className="space-y-3.5">
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

              {/* Ready Quiz Card */}
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

              {/* Locked Quiz Card (Clean, calm soft-lock) */}
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

            {/* Section 2: MAKAUT Exam Papers */}
            <div className="space-y-3.5">
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

                {/* 3 Compact Structure Badges (Zero reading fatigue) */}
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
                  <FileText className="w-4 h-4" />
                  <span>Generate MAKAUT Paper</span>
                </button>
              </div>
            </div>
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="practice" />
      </div>
    </>
  );
}
