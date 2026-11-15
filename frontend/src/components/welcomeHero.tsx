import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CtaButtons from "./ctaButtons";

/**
 * -----------------------------------------------------------------------
 * HERO LAYOUT & TYPOGRAPHY CONFIGURATION
 * Tweak these variables to adjust sizes, gaps, and spacing easily!
 * -----------------------------------------------------------------------
 */
export const HERO_CONFIG = {
  // SPACING & GAPS — values in pixels, applied via inline styles (immune to Tailwind purge)
  heroOffsetTopPx: 32,                           // ↕ Pull entire hero & buttons lower in px ← tweak this
  heroPaddingVertical: "py-2 sm:py-4",           // Overall hero vertical padding (Tailwind safe class)
  heroMaxWidth: "max-w-2xl",                     // Max width of hero container (Tailwind safe class)
  gapStudifyAndHeadlinePx: 15,                   // ↕ Gap between "Studify" and "Headline" in px  ← tweak this
  gapHeadlineAndSublinePx: 2,                   // ↕ Gap between "Headline" and "Subline" in px  ← tweak this
  gapSublineAndButtonsPx: 36,                    // ↕ Gap between Subline and CTA buttons in px  ← tweak this

  // FONT SIZES — safe static Tailwind classes (always present in JSX, detected by scanner)
  welcomeTextSize: "text-xl",                    // Size of "Welcome to"
  studifyTextSize: "text-7xl",                   // Size of "Studify" (base; overridden below via style)
  headlineTextSize: "text-lg",                   // Size of "Your notes, made exam-ready."
  sublineTextSize: "text-sm",                    // Size of Subline description

  // FONT SIZES in rem — applied via inline styles for precise responsive control
  studifyFontSizeRem: 4,                         // "Studify" font size in rem  ← tweak this

  // MAX WIDTH
  sublineMaxWidth: "max-w-md",                   // Max width of the subline paragraph

  // CURSOR SIZES
  welcomeCursorSize: "w-[2px] h-5",             // Blinking cursor size for "Welcome to"
  studifyCursorSize: "w-[4px] h-14",            // Blinking cursor size for "Studify"
};

interface WelcomeHeroProps {
  accentColor?: string;
  accentDark?: string;
  accentSoft?: string;
  inkColor?: string;
  inkMuted?: string;
}

export default function WelcomeHero({
  accentColor = "#E7A9B5",
  accentDark = "#A54C5F",
  accentSoft = "#FBECEE",
  inkColor = "#3B3540",
  inkMuted = "#6B6570",
}: WelcomeHeroProps) {
  const router = useRouter();
  const [welcomeText, setWelcomeText] = useState("");
  const [studifyText, setStudifyText] = useState("");
  const [isWelcomeDone, setIsWelcomeDone] = useState(false);
  const [isStudifyDone, setIsStudifyDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const welcomeTarget = "Welcome to";
    const studifyTarget = "Studify";

    let welcomeIndex = 0;
    let studifyIndex = 0;

    // Step 1: Type "Welcome to"
    const typeWelcome = () => {
      const welcomeInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(welcomeInterval);
          return;
        }

        welcomeIndex++;
        setWelcomeText(welcomeTarget.slice(0, welcomeIndex));

        if (welcomeIndex >= welcomeTarget.length) {
          clearInterval(welcomeInterval);
          setIsWelcomeDone(true);

          // Step 2: Pause briefly then start typing "Studify"
          setTimeout(() => {
            if (!isMounted) return;
            typeStudify();
          }, 280);
        }
      }, 75);
    };

    // Step 3: Type "Studify"
    const typeStudify = () => {
      const studifyInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(studifyInterval);
          return;
        }

        studifyIndex++;
        setStudifyText(studifyTarget.slice(0, studifyIndex));

        if (studifyIndex >= studifyTarget.length) {
          clearInterval(studifyInterval);
          setIsStudifyDone(true);
        }
      }, 90);
    };

    // Initial slight pause before typing starts
    const initialDelay = setTimeout(typeWelcome, 200);

    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
    };
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center justify-center text-center px-4 ${HERO_CONFIG.heroPaddingVertical} select-none transition-transform duration-300`}
      style={{ transform: `translateY(${HERO_CONFIG.heroOffsetTopPx}px)` }}
    >
      <div className={`w-full ${HERO_CONFIG.heroMaxWidth} mx-auto`}>
        {/* Line 1: "Welcome to" in Product Sans font */}
        <div className="min-h-[2rem] flex items-center justify-center">
          <span
            className={`font-body ${HERO_CONFIG.welcomeTextSize} font-medium tracking-wide transition-colors`}
            style={{ color: inkMuted }}
          >
            {welcomeText}
            {/* Blinking cursor while typing line 1 */}
            {!isWelcomeDone && (
              <span
                className={`inline-block ${HERO_CONFIG.welcomeCursorSize} ml-1 align-middle animate-pulse`}
                style={{ backgroundColor: accentDark }}
              />
            )}
          </span>
        </div>

        {/* Line 2: "Studify" with Urbanist font */}
        <div className="flex items-center justify-center leading-none" style={{ minHeight: `${HERO_CONFIG.studifyFontSizeRem * 1.1}rem` }}>
          {isWelcomeDone && (
            <h1
              className={`font-sans ${HERO_CONFIG.studifyTextSize} font-black tracking-tight relative transition-all duration-300`}
              style={{ fontSize: `${HERO_CONFIG.studifyFontSizeRem}rem`, lineHeight: 1, letterSpacing: "-0.04em" }}
            >
              <span
                className="inline-block transition-colors"
                style={{
                  color: inkColor,
                  textShadow: isStudifyDone
                    ? `0 6px 32px ${accentColor}4D`
                    : "none",
                }}
              >
                {studifyText}
              </span>

              {/* Blinking cursor while typing line 2 */}
              {!isStudifyDone && (
                <span
                  className={`inline-block ${HERO_CONFIG.studifyCursorSize} ml-1.5 align-middle animate-pulse`}
                  style={{ backgroundColor: accentDark }}
                />
              )}
            </h1>
          )}
        </div>

        {/* Headline & Subline Section */}
        <div
          className={`transition-all duration-700 ${isStudifyDone
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
            }`}
          style={{ marginTop: `${HERO_CONFIG.gapStudifyAndHeadlinePx}px` }}
        >
          {/* Headline */}
          <h2
            className={`font-sans ${HERO_CONFIG.headlineTextSize} font-semibold tracking-tight`}
            style={{ color: inkColor }}
          >
            Your notes, made exam-ready.
          </h2>

          {/* Subline */}
          <p
            className={`font-body ${HERO_CONFIG.sublineTextSize} leading-relaxed ${HERO_CONFIG.sublineMaxWidth} mx-auto`}
            style={{ color: inkMuted, marginTop: `${HERO_CONFIG.gapHeadlineAndSublinePx}px` }}
          >
            Upload your syllabus and study material. Learn chapter by chapter with notes, quizzes and MAKAUT-style practice papers.
          </p>

          {/* CTA Buttons */}
          <CtaButtons
            accentColor={accentColor}
            accentDark={accentDark}
            accentSoft={accentSoft}
            onStartPrepping={() => router.push("/studentWorkspace")}
            style={{ marginTop: `${HERO_CONFIG.gapSublineAndButtonsPx}px` }}
          />
        </div>
      </div>
    </div>
  );
}
