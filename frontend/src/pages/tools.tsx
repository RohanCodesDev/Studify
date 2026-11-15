import Head from "next/head";
import GpaCalculator from "@/components/gpaCalculator";
import AttendancePlanner from "@/components/attendancePlanner";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function ToolsPage() {
  const { colors } = useTheme();

  return (
    <>
      <Head>
        <title>Academic Tools · Studify</title>
        <meta
          name="description"
          content="Free MAKAUT SGPA/CGPA Calculator and 75% Attendance Planner. Usable without signup."
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
              Free University Utilities
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
              Academic Tools
            </h1>
          </header>

          {/* ── Modular Tool Components ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-6 pb-36">
            {/* Tool 1: Interactive SGPA / CGPA Calculator */}
            <GpaCalculator />

            {/* Tool 2: 75% Attendance Planner */}
            <AttendancePlanner />
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="tools" />
      </div>
    </>
  );
}
