import React, { useEffect, useState } from "react";

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
    <div className="w-full flex flex-col items-center justify-center text-center px-4 py-8 sm:py-12 select-none">
      <div className="space-y-2 sm:space-y-3 max-w-lg mx-auto">
        {/* Line 1: "Welcome to" in Product Sans font, mid size */}
        <div className="min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center">
          <span
            className="font-body text-xl sm:text-2xl md:text-3xl font-medium tracking-wide transition-colors"
            style={{ color: inkMuted }}
          >
            {welcomeText}
            {/* Blinking cursor while typing line 1 */}
            {!isWelcomeDone && (
              <span
                className="inline-block w-[2px] h-5 sm:h-6 ml-1 align-middle animate-pulse"
                style={{ backgroundColor: accentDark }}
              />
            )}
          </span>
        </div>

        {/* Line 2: "Studify" with Urbanist font, large size and glowing accent effect */}
        <div className="min-h-[4rem] sm:min-h-[5.5rem] flex items-center justify-center">
          {isWelcomeDone && (
            <h1 className="font-sans text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight relative transition-all duration-300">
              <span
                className="inline-block transition-colors"
                style={{
                  color: inkColor,
                  textShadow: isStudifyDone
                    ? `0 4px 24px ${accentColor}4D`
                    : "none",
                }}
              >
                {studifyText}
              </span>

              {/* Blinking cursor while typing line 2 */}
              {!isStudifyDone && (
                <span
                  className="inline-block w-[3px] sm:w-[4px] h-10 sm:h-14 ml-1.5 align-middle animate-pulse"
                  style={{ backgroundColor: accentDark }}
                />
              )}
            </h1>
          )}
        </div>

        {/* Delicate Expanding Underline Accent once complete */}
        <div className="flex justify-center pt-1">
          <div
            className="h-1 sm:h-1.5 rounded-full transition-all duration-700 ease-out"
            style={{
              backgroundColor: accentColor,
              width: isStudifyDone ? "4rem" : "0rem",
              opacity: isStudifyDone ? 1 : 0,
            }}
          />
        </div>

        {/* Headline & Subline */}
        <div
          className={`space-y-2.5 pt-2 transition-all duration-700 ${
            isStudifyDone
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {/* Headline: “Your notes, made exam-ready.” */}
          <h2
            className="font-sans text-lg sm:text-xl md:text-2xl font-semibold tracking-tight"
            style={{ color: inkColor }}
          >
            Your notes, made exam-ready.
          </h2>

          {/* Subline */}
          <p
            className="font-body text-xs sm:text-sm md:text-base leading-relaxed max-w-md mx-auto"
            style={{ color: inkMuted }}
          >
            Upload your syllabus and study material. Learn chapter by chapter with notes, quizzes and MAKAUT-style practice papers.
          </p>
        </div>
      </div>
    </div>
  );
}
