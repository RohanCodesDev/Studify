import React, { useEffect, useState } from "react";

/**
 * -----------------------------------------------------------------------
 * HERO LAYOUT & TYPOGRAPHY CONFIGURATION
 * Tweak these variables to adjust sizes, gaps, and spacing easily!
 * -----------------------------------------------------------------------
 */
export const HERO_CONFIG = {
  // SPACING & GAPS
  heroPaddingVertical: "py-4 sm:py-8",                         // Overall hero vertical padding
  heroMaxWidth: "max-w-2xl",                                     // Max width of hero container
  gapBetweenWelcomeAndStudify: "-space-y-1 sm:space-y-0",       // Kept tight so bigger font doesn't increase gap
  gapBetweenStudifyAndHeadline: "mt-10 sm:mt-14 md:mt-16",      // Generous gap between "Studify" and "Headline"
  gapBetweenHeadlineAndSubline: "space-y-2 sm:space-y-2.5",     // Gap between "Headline" and "Subline"
  sublineMaxWidth: "max-w-md sm:max-w-lg",                       // Max width of the subline paragraph

  // FONT SIZES
  welcomeTextSize: "text-xl sm:text-2xl md:text-3xl",           // Size of "Welcome to"
  studifyTextSize: "text-7xl sm:text-8xl md:text-9xl lg:text-[9.5rem] xl:text-[10.5rem] leading-none tracking-tighter", // Increased font size with leading-none
  headlineTextSize: "text-lg sm:text-xl md:text-2xl",           // Size of "Your notes, made exam-ready."
  sublineTextSize: "text-xs sm:text-sm md:text-base",           // Size of Subline description

  // CURSOR SIZES
  welcomeCursorSize: "w-[2px] h-5 sm:h-6",                      // Blinking cursor size for "Welcome to"
  studifyCursorSize: "w-[4px] sm:w-[6px] h-14 sm:h-20 md:h-24", // Blinking cursor size for "Studify"
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
    <div className={`w-full flex flex-col items-center justify-center text-center px-4 ${HERO_CONFIG.heroPaddingVertical} select-none`}>
      <div className={`w-full ${HERO_CONFIG.heroMaxWidth} mx-auto ${HERO_CONFIG.gapBetweenWelcomeAndStudify}`}>
        {/* Line 1: "Welcome to" in Product Sans font */}
        <div className="min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
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
        <div className="min-h-[5rem] sm:min-h-[6.5rem] md:min-h-[8.5rem] lg:min-h-[10rem] flex items-center justify-center leading-none">
          {isWelcomeDone && (
            <h1 className={`font-sans ${HERO_CONFIG.studifyTextSize} font-black tracking-tight relative transition-all duration-300`}>
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
          className={`${HERO_CONFIG.gapBetweenStudifyAndHeadline} ${HERO_CONFIG.gapBetweenHeadlineAndSubline} transition-all duration-700 ${isStudifyDone
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
            }`}
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
            style={{ color: inkMuted }}
          >
            Upload your syllabus and study material. Learn chapter by chapter with notes, quizzes and MAKAUT-style practice papers.
          </p>
        </div>
      </div>
    </div>
  );
}
