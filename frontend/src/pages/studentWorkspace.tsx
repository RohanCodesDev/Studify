import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Greeting from "@/components/greeting";
import QuickStudyCard, { QuickStudyPayload } from "@/components/quickStudyCard";
import SessionStudyCard, { PrevSessionData } from "@/components/sessionStudyCard";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function StudentWorkspace() {
  const router = useRouter();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState("home");

  const [isIngesting, setIsIngesting] = useState(false);

  // Example previous session state (can be null for new students, or populated once started)
  const [currentSession, setCurrentSession] = useState<PrevSessionData | null>({
    id: "sess_dbms",
    subjectCode: "PCC-CS501",
    subjectName: "Database Management Systems",
    currentChapter: "Module 3: Normalization (3NF vs BCNF)",
    progressPercent: 68,
    topicsCovered: 4,
    totalTopics: 6,
    lastActive: "Today at 11:30 AM",
  });

  const handleStartQuickStudy = async (payload: QuickStudyPayload) => {
    try {
      setIsIngesting(true);

      // Create a fresh unique session ID for every new material upload
      const newSessionId = "sess_" + Date.now().toString(36);
      let targetSessionId = newSessionId;

      if (payload.file) {
        const formData = new FormData();
        formData.append("file", payload.file);
        formData.append("sessionId", newSessionId);
        formData.append("subjectCode", "PCC-CS501");

        const res = await fetch("/api/ingest", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.sessionId) targetSessionId = data.sessionId;
        }
      } else if (payload.text && payload.text.trim()) {
        const res = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: payload.text.trim(),
            sessionId: newSessionId,
            subjectCode: "PCC-CS501",
            fileName: "quick_notes.txt",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.sessionId) targetSessionId = data.sessionId;
        }
      }

      router.push(`/study/${targetSessionId}`);
    } catch (err) {
      console.warn("Ingestion request completed with fallback:", err);
      router.push("/study/sess_dbms");
    } finally {
      setIsIngesting(false);
    }
  };

  const handleStartNewSession = () => {
    router.push("/sessions");
  };

  const handleResumeSession = (sessionId: string) => {
    router.push(`/study/${sessionId}`);
  };

  return (
    <>
      <Head>
        <title>Studify · Prep Hub</title>
        <meta
          name="description"
          content="Your central workspace for syllabus learning, quick study notes, quizzes, and MAKAUT exam papers."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── Page shell: scrollable, full height with bottom padding for dock ── */}
      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col overflow-x-hidden transition-colors duration-300 font-sans"
        style={{ backgroundColor: colors.pageBg, color: colors.ink }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          {/* ══ Greeting (first section) ══ */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Greeting />
          </motion.div>

          {/* ══ Study Modes (Two Separate Cards) ══ */}
          <main className="w-full px-4 sm:px-6 py-2 flex flex-col gap-5 sm:gap-6 pb-36">
            {/* Signature Feature: Session Study */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <SessionStudyCard
                prevSession={currentSession}
                onStartNewSession={handleStartNewSession}
                onResumeSession={handleResumeSession}
              />
            </motion.div>

            {/* Base Ingestion: Quick Study */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <QuickStudyCard
                onStartQuickStudy={handleStartQuickStudy}
                isLoading={isIngesting}
              />
            </motion.div>

            {/* ══ Next Sections (Practice Row, Free Tools) will be mounted here ══ */}
          </main>
        </div>

        {/* ══ Mobile Thumb Bottom Navigation Bar ══ */}
        <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </div>
    </>
  );
}
