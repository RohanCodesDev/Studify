import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import StudentProfileCard from "@/components/studentProfileCard";
import ProfileLinksCard from "@/components/profileLinksCard";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

export default function ProfilePage() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

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
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl border backdrop-blur-md transition-all active:scale-[0.98] shadow-sm"
              style={{
                backgroundColor: isDarkMode ? `${colors.cardBg}CC` : `${colors.cardBg}E6`,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <Settings className="w-4 h-4" style={{ color: colors.accentDark }} />
            </button>
          </motion.header>

          {/* ── Modular Profile Components ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-5 pb-36">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <StudentProfileCard />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProfileLinksCard />
            </motion.div>
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="profile" />
      </div>
    </>
  );
}
