import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import AdaptiveQuizzesSection from "@/components/adaptiveQuizzesSection";
import ExamSimulationCard from "@/components/examSimulationCard";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function PracticePage() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleStartQuiz = (quizId: string) => {
    router.push(`/practice/quiz/${quizId}`);
  };

  const handleGeneratePaper = () => {
    console.log("Generating MAKAUT practice paper...");
  };

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
          <motion.header
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="px-4 sm:px-6 py-5 sm:py-6"
          >
            <span
              className="text-xs font-body tracking-wide"
              style={{ color: colors.inkMuted }}
            >
              Exam Readiness &amp; Drills
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
              Practice Arena
            </h1>
          </motion.header>

          {/* ── Modular Section Components ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-6 pb-36">
            {/* Section 1: Adaptive Chapter Quizzes */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <AdaptiveQuizzesSection onStartQuiz={handleStartQuiz} />
            </motion.div>

            {/* Section 2: Authentic MAKAUT Exam Paper Simulation */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ExamSimulationCard onGeneratePaper={handleGeneratePaper} />
            </motion.div>
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="practice" />
      </div>
    </>
  );
}
