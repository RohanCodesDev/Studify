import Head from "next/head";
import { useEffect } from "react";
import WelcomeHero from "@/components/welcomeHero";
import MuralIllustration from "@/components/muralIllustration";
import Snowflakes, { SNOW_CONFIG } from "@/components/snowflakes";
import { COLOR_PROFILES } from "@/context/ThemeContext";

// Landing screen is locked to the cool slate "November Rain" palette
const NOVEMBER_RAIN =
  COLOR_PROFILES.find((p) => p.id === "november-rain") || COLOR_PROFILES[0];
const LANDING_COLORS = NOVEMBER_RAIN.light;

export default function Home() {
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
          backgroundColor: LANDING_COLORS.pageBg,
          color: LANDING_COLORS.ink,
        }}
      >
        {/* Subtle Falling Snowflakes Animation in Sky Blue */}
        <Snowflakes color={SNOW_CONFIG.skyBlueColor} />

        {/* Main Hero Container */}
        <main className="flex-1 w-full flex flex-col justify-center items-center relative z-10 my-auto py-2 sm:py-4">
          <WelcomeHero
            accentColor={LANDING_COLORS.accent}
            accentDark={LANDING_COLORS.accentDark}
            accentSoft={LANDING_COLORS.accentSoft}
            inkColor={LANDING_COLORS.ink}
            inkMuted={LANDING_COLORS.inkMuted}
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
