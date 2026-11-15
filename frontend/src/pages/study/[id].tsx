"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  Sparkles,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { MOCK_STUDY_TOPICS, StudyTopicData } from "@/data/mockStudyNotes";
import MarksTabBar, { MarksFormat } from "@/components/readingView/marksTabBar";
import ReadingNoteRenderer from "@/components/readingView/readingNoteRenderer";

export default function StudyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { colors, isDarkMode } = useTheme();

  // Resolve study topic or fallback to DBMS
  const topicId = typeof id === "string" ? id : "sess_dbms";
  const topic: StudyTopicData = MOCK_STUDY_TOPICS[topicId] || MOCK_STUDY_TOPICS["sess_dbms"];

  const [activeFormat, setActiveFormat] = useState<MarksFormat>("fiveMarks");
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/studentWorkspace");
    }
  };

  const handleGoToQuiz = () => {
    router.push("/practice");
  };

  return (
    <>
      <Head>
        <title>{`${topic.topicTitle} · Studify Reading`}</title>
        <meta
          name="description"
          content={`MAKAUT syllabus notes for ${topic.subjectCode}: ${topic.topicTitle}. Formatted for 1, 5, and 15 marks.`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col font-sans transition-colors duration-300 overflow-x-hidden"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        {/* ══════════════════════════════════════════════════════
            1. TOP NAVIGATION HEADER (Fades out in Focus Mode)
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {!isFocusMode && (
            <motion.header
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sticky top-0 z-20 w-full backdrop-blur-xl border-b px-4 sm:px-6 py-2.5 transition-colors duration-300"
              style={{
                backgroundColor: isDarkMode ? `${colors.cardBg}E6` : `${colors.cardBg}CC`,
                borderColor: colors.border,
              }}
            >
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  aria-label="Back"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 rounded-2xl border transition-all active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    color: colors.ink,
                  }}
                >
                  <ArrowLeft className="w-5 h-5" style={{ color: colors.accentDark }} />
                </button>

                {/* Center title info */}
                <div className="flex flex-col items-center text-center px-2">
                  <span
                    className="text-xs font-sans font-bold tracking-tight truncate max-w-[200px]"
                    style={{ color: colors.ink }}
                  >
                    {topic.subjectCode}
                  </span>
                  <span
                    className="text-[11px] font-body opacity-65 truncate max-w-[200px]"
                    style={{ color: colors.inkMuted }}
                  >
                    {topic.moduleName}
                  </span>
                </div>

                {/* Focus mode trigger button */}
                <button
                  type="button"
                  onClick={() => setIsFocusMode(true)}
                  aria-label="Enter Focus Mode"
                  className="min-h-[44px] px-3 rounded-2xl border flex items-center gap-1.5 text-xs font-sans font-semibold transition-all active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.accent,
                    color: colors.accentDark,
                  }}
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Focus</span>
                </button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            FLOATING EXIT FOCUS MODE PILL (When in Focus Mode)
        ══════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {isFocusMode && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 right-4 z-50 pointer-events-auto"
            >
              <button
                type="button"
                onClick={() => setIsFocusMode(false)}
                className="min-h-[44px] px-4 py-2 rounded-full border backdrop-blur-xl shadow-lg flex items-center gap-2 text-xs font-sans font-semibold transition-transform active:scale-95"
                style={{
                  backgroundColor: isDarkMode ? `${colors.cardBg}F0` : `${colors.cardBg}E6`,
                  borderColor: colors.accent,
                  color: colors.accentDark,
                  boxShadow: `0 8px 24px -4px ${colors.accent}4D`,
                }}
              >
                <EyeOff className="w-4 h-4" />
                <span>Exit Focus Mode</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══════════════════════════════════════════════════════
            2. MAIN READING CONTAINER
        ══════════════════════════════════════════════════════ */}
        <main
          className={`w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col gap-5 ${
            isFocusMode ? "pt-12 pb-24" : "py-5 pb-32"
          }`}
        >
          {/* ── Topic Header Card ── */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                style={{
                  backgroundColor: colors.accentSoft,
                  color: colors.accentDark,
                }}
              >
                {topic.subjectCode} · {topic.subjectName}
              </span>

              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                style={{
                  backgroundColor: "#EAF3E8",
                  color: "#2E5929",
                }}
              >
                ✓ Syllabus Mapped
              </span>

              <span
                className="text-[11px] font-body opacity-60 ml-auto"
                style={{ color: colors.inkMuted }}
              >
                {topic.estimatedReadTime}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight leading-snug">
              {topic.topicTitle}
            </h1>

            <p className="text-xs font-body opacity-75" style={{ color: colors.inkMuted }}>
              🔥 {topic.pyqFrequency}
            </p>
          </section>

          {/* ── Sticky Marks Selector Tab Bar ── */}
          <div className="sticky top-14 sm:top-16 z-10 pt-1 pb-1">
            <MarksTabBar
              activeFormat={activeFormat}
              onChangeFormat={setActiveFormat}
            />
          </div>

          {/* ── Rendered Note Content ── */}
          <ReadingNoteRenderer notes={topic.notes} activeFormat={activeFormat} />

          {/* ── Bottom Reading Controls ── */}
          {!isFocusMode && (
            <section
              className="mt-6 p-5 rounded-3xl border shadow-sm transition-all flex flex-col gap-4"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-sans font-bold tracking-tight">
                  Topic Completion
                </h3>

                <button
                  type="button"
                  onClick={() => setIsCompleted((prev) => !prev)}
                  className="min-h-[44px] px-3.5 py-2 rounded-2xl border text-xs font-sans font-semibold flex items-center gap-1.5 transition-all active:scale-95"
                  style={
                    isCompleted
                      ? {
                          backgroundColor: "#EAF3E8",
                          borderColor: "#A9C5A7",
                          color: "#2E5929",
                        }
                      : {
                          backgroundColor: colors.cardBg,
                          borderColor: colors.border,
                          color: colors.ink,
                        }
                  }
                >
                  <Check className="w-4 h-4" />
                  <span>{isCompleted ? "Understood!" : "Mark as Read"}</span>
                </button>
              </div>

              <div className="pt-2 border-t grid grid-cols-2 gap-2.5" style={{ borderColor: colors.border }}>
                <button
                  type="button"
                  onClick={handleGoToQuiz}
                  className="min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-sans font-semibold flex items-center justify-center gap-1.5 border transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accent,
                    color: colors.accentDark,
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Practice Quiz</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/sessions")}
                  className="min-h-[44px] py-2.5 px-3 rounded-2xl text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-sm"
                  style={{
                    backgroundColor: colors.accentDark,
                    color: "#FFFFFF",
                  }}
                >
                  <span>All Sessions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
