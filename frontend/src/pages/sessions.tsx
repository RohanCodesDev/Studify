import Head from "next/head";
import { useState } from "react";
import { BookOpen, Plus, ArrowRight, Clock, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

interface SessionItem {
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

const INITIAL_SESSIONS: SessionItem[] = [
  {
    id: "sess_dbms",
    code: "PCC-CS501",
    name: "Database Management Systems",
    semester: "Semester 5 · CSE",
    chapter: "Module 3: Relational Normalization (3NF & BCNF)",
    progressPercent: 68,
    topicsReady: 4,
    totalTopics: 6,
    lastStudied: "Today, 11:30 AM",
  },
  {
    id: "sess_os",
    code: "PCC-CS502",
    name: "Operating Systems",
    semester: "Semester 5 · CSE",
    chapter: "Module 2: Process Scheduling & Synchronization",
    progressPercent: 42,
    topicsReady: 3,
    totalTopics: 7,
    lastStudied: "Yesterday",
  },
];

export default function SessionsPage() {
  const { colors, isDarkMode } = useTheme();
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);

  return (
    <>
      <Head>
        <title>Study Sessions · Studify</title>
        <meta
          name="description"
          content="Syllabus-mapped study sessions for MAKAUT courses. Learn chapter by chapter."
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
          <header className="px-4 sm:px-6 py-5 sm:py-6 flex items-start justify-between">
            <div>
              <span
                className="text-xs font-body tracking-wide"
                style={{ color: colors.inkMuted }}
              >
                MAKAUT Syllabus Map
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
                Study Sessions
              </h1>
            </div>

            <button
              type="button"
              className="min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              style={{
                backgroundColor: colors.accentDark,
                color: "#FFFFFF",
                boxShadow: `0 4px 14px ${colors.accent}55`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </button>
          </header>

          {/* ── Content Container ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-4 pb-36">
            {/* Active Sessions List */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs uppercase tracking-wider font-semibold opacity-70"
                  style={{ color: colors.ink }}
                >
                  Active Courses ({sessions.length})
                </span>
                <span
                  className="text-xs font-body opacity-60"
                  style={{ color: colors.inkMuted }}
                >
                  Chapter Progress
                </span>
              </div>

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

            {/* Quick add prompt */}
            <div
              className="p-5 rounded-3xl border border-dashed text-center flex flex-col items-center justify-center gap-2 transition-colors"
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
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="sessions" />
      </div>
    </>
  );
}
