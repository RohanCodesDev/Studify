import Head from "next/head";
import AdaptiveQuizzesSection from "@/components/adaptiveQuizzesSection";
import ExamSimulationCard from "@/components/examSimulationCard";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function PracticePage() {
  const { colors } = useTheme();

  const handleStartQuiz = (quizId: string) => {
    console.log("Start quiz:", quizId);
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

          {/* ── Modular Section Components ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-6 pb-36">
            {/* Section 1: Adaptive Chapter Quizzes */}
            <AdaptiveQuizzesSection onStartQuiz={handleStartQuiz} />

            {/* Section 2: Authentic MAKAUT Exam Paper Simulation */}
            <ExamSimulationCard onGeneratePaper={handleGeneratePaper} />
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="practice" />
      </div>
    </>
  );
}
