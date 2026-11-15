import Head from "next/head";
import { useRouter } from "next/router";
import { User, Settings, Sparkles, BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function ProfilePage() {
  const router = useRouter();
  const { colors, activeProfile, isDarkMode } = useTheme();

  return (
    <>
      <Head>
        <title>Student Profile · Studify</title>
        <meta
          name="description"
          content="Manage your MAKAUT student profile, academic semester, and study preferences."
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
                Academic Record
              </span>
              <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
                Student Profile
              </h1>
            </div>

            <button
              type="button"
              onClick={() => router.push("/settings")}
              aria-label="Open Settings"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border backdrop-blur-md transition-all active:scale-95 shadow-sm"
              style={{
                backgroundColor: isDarkMode ? `${colors.cardBg}CC` : `${colors.cardBg}E6`,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <Settings className="w-4 h-4" style={{ color: colors.accentDark }} />
            </button>
          </header>

          {/* ── Main Content Container ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-5 pb-36">
            {/* Student Info Card */}
            <div
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex items-start gap-4"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-sans font-bold text-lg shrink-0 border"
                style={{
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accent,
                  color: colors.accentDark,
                }}
              >
                ST
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
                    Student Workspace
                  </h2>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: colors.accentSoft,
                      color: colors.accentDark,
                    }}
                  >
                    Active
                  </span>
                </div>

                <p
                  className="text-xs font-body leading-relaxed"
                  style={{ color: colors.inkMuted }}
                >
                  B.Tech · Computer Science &amp; Engineering (CSE)
                </p>
                <p
                  className="text-[11px] font-body opacity-70"
                  style={{ color: colors.inkMuted }}
                >
                  Maulana Abul Kalam Azad University of Technology (MAKAUT) · Sem 5
                </p>
              </div>
            </div>

            {/* Academic Stats Overview */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="p-3.5 rounded-2xl border text-center transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="text-base sm:text-lg font-sans font-bold"
                  style={{ color: colors.accentDark }}
                >
                  2
                </div>
                <div className="text-[10px] font-body opacity-65">
                  Active Sessions
                </div>
              </div>

              <div
                className="p-3.5 rounded-2xl border text-center transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="text-base sm:text-lg font-sans font-bold"
                  style={{ color: colors.accentDark }}
                >
                  14
                </div>
                <div className="text-[10px] font-body opacity-65">
                  Notes Ready
                </div>
              </div>

              <div
                className="p-3.5 rounded-2xl border text-center transition-colors"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="text-base sm:text-lg font-sans font-bold"
                  style={{ color: colors.accentDark }}
                >
                  85%
                </div>
                <div className="text-[10px] font-body opacity-65">
                  Quiz Accuracy
                </div>
              </div>
            </div>

            {/* Navigation links & Preferences */}
            <div
              className="rounded-3xl border overflow-hidden transition-colors"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <button
                type="button"
                onClick={() => router.push("/settings")}
                className="w-full min-h-[50px] p-4 flex items-center justify-between border-b transition-colors text-left active:scale-[0.99]"
                style={{ borderColor: colors.border }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.accentSoft,
                      color: colors.accentDark,
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-sans font-semibold">
                      Appearance &amp; Colour Palette
                    </div>
                    <div
                      className="text-[11px] font-body opacity-65"
                      style={{ color: colors.inkMuted }}
                    >
                      Active: {activeProfile.name} ({isDarkMode ? "Dark" : "Light"})
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>

              <button
                type="button"
                onClick={() => router.push("/tools")}
                className="w-full min-h-[50px] p-4 flex items-center justify-between transition-colors text-left active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.accentSoft,
                      color: colors.accentDark,
                    }}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-sans font-semibold">
                      Academic Calculators
                    </div>
                    <div
                      className="text-[11px] font-body opacity-65"
                      style={{ color: colors.inkMuted }}
                    >
                      SGPA / CGPA and 75% Attendance planner
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-40" />
              </button>
            </div>
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="profile" />
      </div>
    </>
  );
}
