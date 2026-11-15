import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Settings } from "lucide-react";
import WelcomeHero from "@/components/welcomeHero";
import MuralIllustration from "@/components/muralIllustration";
import Snowflakes, { SNOW_CONFIG } from "@/components/snowflakes";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
  const router = useRouter();
  const { colors, activeProfile, isDarkMode } = useTheme();

  // Landing page viewport lock (prevents scrolling on landing page only)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHeight = document.body.style.height;
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.height = originalHeight;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Studify · MAKAUT Study Platform</title>
        <meta
          name="description"
          content="Your notes, made exam-ready. Upload your syllabus and study material. Learn chapter by chapter with notes, quizzes and MAKAUT-style practice papers."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full h-screen h-[100dvh] max-h-[100dvh] relative flex flex-col justify-between overflow-hidden transition-colors duration-300 font-sans"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        {/* Subtle Falling Snowflakes Animation in Sky Blue */}
        <Snowflakes
          color={isDarkMode ? SNOW_CONFIG.skyBlueDarkColor : SNOW_CONFIG.skyBlueColor}
        />

        {/* Floating Top-Right Settings Icon navigating to /settings */}
        <button
          onClick={() => router.push("/settings")}
          aria-label="Open Theme Settings"
          className="fixed top-3 right-3 sm:top-5 sm:right-6 z-30 min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border backdrop-blur-md transition-all active:scale-95 shadow-sm"
          style={{
            backgroundColor: isDarkMode ? `${colors.cardBg}CC` : `${colors.cardBg}E6`,
            borderColor: colors.border,
            color: colors.ink,
          }}
        >
          <Settings className="w-4 h-4" style={{ color: colors.accentDark }} />
          <span
            className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: activeProfile.light.accent }}
          />
        </button>

        {/* Main Hero Container */}
        <main className="flex-1 w-full flex flex-col justify-center items-center relative z-10 my-auto py-2 sm:py-4">
          <WelcomeHero
            accentColor={colors.accent}
            accentDark={colors.accentDark}
            accentSoft={colors.accentSoft}
            inkColor={colors.ink}
            inkMuted={colors.inkMuted}
          />
        </main>

        {/* Mountain Mural Illustration at Full Width of Mobile Screen from Bottom */}
        <footer className="w-full relative z-10 mt-auto shrink-0 pointer-events-none">
          <MuralIllustration />
        </footer>
      </div>
    </>
  );
}
