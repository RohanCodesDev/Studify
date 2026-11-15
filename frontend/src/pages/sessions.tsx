import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import ActiveSessionsList, { SessionItem } from "@/components/activeSessionsList";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

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
  const router = useRouter();
  const { colors } = useTheme();
  const [sessions, setSessions] = useState<SessionItem[]>(INITIAL_SESSIONS);

  const handleContinueChapter = (id: string) => {
    router.push(`/study/${id}`);
  };

  const handleAddSubject = () => {
    console.log("Add subject clicked");
  };

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
          <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 sm:px-6 py-5 sm:py-6 flex items-start justify-between"
          >
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
              onClick={handleAddSubject}
              className="min-h-[44px] px-3.5 py-2 rounded-2xl text-xs font-sans font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98]"
              style={{
                backgroundColor: colors.accentDark,
                color: "#FFFFFF",
                boxShadow: `0 4px 14px ${colors.accent}55`,
              }}
            >
              <Plus className="w-4 h-4" />
              <span>New Session</span>
            </button>
          </motion.header>

          {/* ── Modular Active Sessions Component ── */}
          <motion.main
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-full px-4 sm:px-6 pb-36"
          >
            <ActiveSessionsList
              sessions={sessions}
              onContinueChapter={handleContinueChapter}
              onAddSubject={handleAddSubject}
            />
          </motion.main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="sessions" />
      </div>
    </>
  );
}
