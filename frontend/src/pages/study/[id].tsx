"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
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
  FileText,
  ChevronDown,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { MOCK_STUDY_TOPICS, StudyTopicData } from "@/data/mockStudyNotes";
import MarksTabBar, { MarksFormat } from "@/components/readingView/marksTabBar";
import ReadingNoteRenderer from "@/components/readingView/readingNoteRenderer";

export interface IngestedChunk {
  id: string;
  sessionId: string;
  fileName: string;
  pageNumber: number;
  sectionTitle: string;
  contentText: string;
  createdAt: string;
}

export default function StudyPage() {
  const router = useRouter();
  const { id } = router.query;
  const { colors, isDarkMode } = useTheme();

  // Resolve study topic or fallback to DBMS
  const topicId = typeof id === "string" ? id : "sess_dbms";
  const isMockDbms = topicId === "sess_dbms";
  const topic: StudyTopicData = MOCK_STUDY_TOPICS[topicId] || MOCK_STUDY_TOPICS["sess_dbms"];

  const [sessionMeta, setSessionMeta] = useState<{
    subjectCode?: string;
    subjectName?: string;
    chapter?: string;
  } | null>(null);

  const [activeFormat, setActiveFormat] = useState<MarksFormat>("fiveMarks");
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [ingestedChunks, setIngestedChunks] = useState<IngestedChunk[]>([]);
  const [showSourceDrawer, setShowSourceDrawer] = useState<boolean>(false);

  // Section-by-section on-demand synthesis state
  const [sectionIndex, setSectionIndex] = useState<number>(0);
  const [sectionData, setSectionData] = useState<{
    sectionTitle: string;
    nextSectionTitle: string | null;
    totalSections: number;
    provider: string;
    isCached: boolean;
    notes: any;
  } | null>(null);
  const [isSectionLoading, setIsSectionLoading] = useState<boolean>(false);

  const fetchSectionNotes = async (targetIndex: number) => {
    if (!id || typeof id !== "string") return;
    try {
      setIsSectionLoading(true);
      const res = await fetch(`/api/notes/${id}/section/${targetIndex}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.notes) {
          setSectionData({
            sectionTitle: data.sectionTitle,
            nextSectionTitle: data.nextSectionTitle,
            totalSections: data.totalSections,
            provider: data.provider,
            isCached: data.isCached,
            notes: data.notes,
          });
          setSectionIndex(data.sectionIndex);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } catch (err) {
      console.warn("Section notes fetch fallback to default:", err);
    } finally {
      setIsSectionLoading(false);
    }
  };

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    let isMounted = true;

    // 1. Fetch session metadata if available from database
    fetch(`/api/sessions/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && data.session) {
          setSessionMeta({
            subjectCode: data.session.subjectCode,
            subjectName: data.session.subjectName,
            chapter: data.session.currentChapter || data.session.chapter,
          });
        }
      })
      .catch(() => {});

    // 2. Fetch extracted chunks
    fetch(`/api/ingest/chunks/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data && data.success && Array.isArray(data.chunks)) {
          setIngestedChunks(data.chunks);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch chunks for session:", err);
      });

    // 3. Fetch Section 0 notes on mount
    fetchSectionNotes(0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/studentWorkspace");
    }
  };

  const handleGoToQuiz = () => {
    router.push("/practice/quiz/quiz_dbms_m3");
  };

  return (
    <>
      <Head>
        <title>{`${sectionData?.sectionTitle || sessionMeta?.chapter || (isMockDbms ? topic.topicTitle : "Study Notes")} · Studify`}</title>
        <meta
          name="description"
          content={`Study notes for ${isMockDbms ? topic.subjectCode : (sessionMeta?.subjectName || "Study Material")}. Formatted for 1, 5, and 15 marks.`}
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

                {/* Center title info (Generic & cleanly decoupled from section H1) */}
                <div className="flex flex-col items-center text-center px-2">
                  <span
                    className="text-xs font-sans font-bold tracking-tight truncate max-w-[200px]"
                    style={{ color: colors.ink }}
                  >
                    {isMockDbms ? "PCC-CS501 · DBMS" : sessionMeta?.subjectName || "Study Notes"}
                  </span>
                  <span
                    className="text-[11px] font-body opacity-65 truncate max-w-[200px]"
                    style={{ color: colors.inkMuted }}
                  >
                    {sectionData ? `Section ${sectionIndex + 1} of ${sectionData.totalSections}` : "Study Material"}
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
                {isMockDbms ? `${topic.subjectCode} · ${topic.subjectName}` : sessionMeta?.subjectName || "Uploaded Study Notes"}
              </span>

              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                style={{
                  backgroundColor: "#EAF3E8",
                  color: "#2E5929",
                }}
              >
                {isMockDbms ? "✓ Syllabus Mapped" : "✓ Document Grounded"}
              </span>

              <span
                className="text-[11px] font-body opacity-60 ml-auto"
                style={{ color: colors.inkMuted }}
              >
                {topic.estimatedReadTime}
              </span>
            </div>

            {/* Section step info (Clean & human-readable, NO developer Groq badges) */}
            {sectionData && (
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-bold"
                  style={{
                    backgroundColor: colors.accentSoft,
                    color: colors.accentDark,
                  }}
                >
                  Section {sectionIndex + 1} of {sectionData.totalSections}
                </span>
              </div>
            )}

            <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight leading-snug">
              {sectionData?.sectionTitle || sessionMeta?.chapter || topic.topicTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-2">
              {isMockDbms ? (
                <p className="text-xs font-body opacity-75" style={{ color: colors.inkMuted }}>
                  🔥 {topic.pyqFrequency}
                </p>
              ) : (
                <p className="text-xs font-body opacity-75" style={{ color: colors.inkMuted }}>
                  📄 Synthesized from your uploaded study document
                </p>
              )}

              {/* Source grounding pill (shown when student uploaded course material) */}
              {ingestedChunks.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowSourceDrawer(!showSourceDrawer)}
                  aria-expanded={showSourceDrawer}
                  className="px-2.5 py-1 rounded-full text-[11px] font-sans font-medium border flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    color: colors.ink,
                  }}
                >
                  <FileText className="w-3.5 h-3.5" style={{ color: colors.accentDark }} />
                  <span>
                    Source: {ingestedChunks[0]?.fileName ? ingestedChunks[0].fileName.replace(/^[0-9]+-/, "") : "Study Material"} ({ingestedChunks.length} sections)
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      showSourceDrawer ? "rotate-180" : ""
                    }`}
                    style={{ color: colors.inkMuted }}
                  />
                </button>
              )}
            </div>

            {/* Expandable Source Material Drawer */}
            <AnimatePresence>
              {showSourceDrawer && ingestedChunks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -6 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className="p-4 sm:p-5 rounded-2xl border flex flex-col gap-3 shadow-sm my-1"
                    style={{
                      backgroundColor: isDarkMode ? "#1B1719" : "#FCFAF8",
                      borderColor: colors.border,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" style={{ color: colors.accentDark }} />
                        <h4 className="text-xs font-sans font-bold tracking-tight uppercase">
                          Source Material
                        </h4>
                      </div>
                      <span className="text-[11px] font-body opacity-60" style={{ color: colors.inkMuted }}>
                        Reference from uploaded document
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {ingestedChunks.map((chunk, idx) => (
                        <div
                          key={chunk.id || idx}
                          className="p-3 rounded-xl border text-xs font-body transition-colors"
                          style={{
                            backgroundColor: colors.cardBg,
                            borderColor: colors.border,
                            color: colors.ink,
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className="font-sans font-semibold text-[11px]"
                              style={{ color: colors.accentDark }}
                            >
                              Section #{idx + 1} · Page {chunk.pageNumber} · {chunk.sectionTitle}
                            </span>
                          </div>
                          <p className="leading-relaxed opacity-85 whitespace-pre-wrap font-mono text-[11px]">
                            {chunk.contentText}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ── Sticky Marks Selector Tab Bar ── */}
          <div className="sticky top-14 sm:top-16 z-10 pt-1 pb-1">
            <MarksTabBar
              activeFormat={activeFormat}
              onChangeFormat={setActiveFormat}
            />
          </div>

          {/* ── Rendered Note Content ── */}
          {isSectionLoading && !sectionData ? (
            <div className="flex flex-col gap-4 font-body animate-pulse">
              <div
                className="p-5 sm:p-6 rounded-3xl border flex flex-col gap-3 shadow-xs"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-4 h-4 border-2 rounded-full animate-spin"
                    style={{
                      borderColor: colors.accentDark,
                      borderTopColor: "transparent",
                    }}
                  />
                  <span
                    className="text-xs font-sans font-bold uppercase tracking-wider"
                    style={{ color: colors.accentDark }}
                  >
                    Synthesizing Section 1 Notes...
                  </span>
                </div>
                <p className="text-xs font-body opacity-75" style={{ color: colors.inkMuted }}>
                  Analyzing your uploaded study material and formulating 1m, 5m, and 15m exam answers.
                </p>
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-3/4 mt-2" />
                <div className="h-4 bg-black/5 dark:bg-white/5 rounded-full w-1/2" />
                <div className="h-24 bg-black/5 dark:bg-white/5 rounded-2xl w-full mt-2" />
              </div>
            </div>
          ) : (
            <ReadingNoteRenderer notes={sectionData?.notes || topic.notes} activeFormat={activeFormat} />
          )}

          {/* ── On-Demand Next Section Synthesis Card ("This is how we buy time") ── */}
          {sectionData?.nextSectionTitle && !isFocusMode && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-sans font-bold uppercase tracking-wider"
                  style={{ color: colors.accentDark }}
                >
                  Up Next · Section {sectionIndex + 2} of {sectionData.totalSections}
                </span>
                {sectionData.isCached && (
                  <span className="text-[10px] font-sans px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                    ✓ Cached Instant
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-sans font-bold tracking-tight">
                {sectionData.nextSectionTitle}
              </h3>

              <div className="flex items-center gap-2 pt-1">
                {sectionIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => fetchSectionNotes(sectionIndex - 1)}
                    disabled={isSectionLoading}
                    className="min-h-[46px] px-4 rounded-2xl text-xs font-sans font-semibold border flex items-center gap-1.5 transition-all active:scale-[0.98]"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.border,
                      color: colors.inkMuted,
                    }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => fetchSectionNotes(sectionIndex + 1)}
                  disabled={isSectionLoading}
                  className="flex-1 min-h-[46px] px-4 rounded-2xl text-xs sm:text-sm font-sans font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm"
                  style={{
                    backgroundColor: colors.accentDark,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 14px ${colors.accent}55`,
                  }}
                >
                  {isSectionLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Synthesizing Next Section...</span>
                    </span>
                  ) : (
                    <>
                      <span>Proceed to Next Section</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

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
