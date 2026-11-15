import Head from "next/head";
import Greeting from "@/components/greeting";
import { useTheme } from "@/context/ThemeContext";

export default function StudentWorkspace() {
  const { colors } = useTheme();

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

      {/* ── Page shell: scrollable, full height ── */}
      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col overflow-x-hidden transition-colors duration-300 font-sans"
        style={{ backgroundColor: colors.pageBg, color: colors.ink }}
      >
        {/* ══ Greeting (first section) — automatically uses active theme & navigates to /settings ══ */}
        <Greeting />

        {/* ══ Remaining prep-hub sections will be mounted here: ══ */}
        {/* - Two large mode cards: Quick Study & Session Study */}
        {/* - Continue where you left off (progress ring) */}
        {/* - Practice row (Quizzes & Practice Papers) */}
        {/* - Free tools (CGPA & Attendance) */}
        {/* - Bottom nav bar */}
        <main className="flex-1 px-4 sm:px-6 pb-32">
          {/* Section placeholder */}
        </main>
      </div>
    </>
  );
}
