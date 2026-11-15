"use client";

import { useEffect, useState } from "react";
import { Settings } from "lucide-react";

// ─── Tweakable layout config ───────────────────────────────────────────────
export const GREETING_CONFIG = {
  paddingX: "px-4 sm:px-6",
  paddingY: "py-4 sm:py-5",
  greetingLabelSize: "text-xs sm:text-sm",
  headlineSize: "text-2xl sm:text-3xl",
  iconSize: 16,
  pillBorderRadius: "rounded-2xl",
  swatchSize: "w-3 h-3",
  transitionDuration: 200,
};

// ─── Props ─────────────────────────────────────────────────────────────────
interface GreetingProps {
  name?: string;
  accentColor?: string;
  accentDark?: string;
  accentSoft?: string;
  inkColor?: string;
  inkMuted?: string;
  cardBg?: string;
  border?: string;
  isDarkMode?: boolean;
  onOpenSettings?: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function getTimeGreeting(hours: number): string {
  if (hours < 12) return "Good morning";
  if (hours < 17) return "Good afternoon";
  if (hours < 21) return "Good evening";
  return "Good night";
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function Greeting({
  name,
  accentColor = "#E7A9B5",
  accentDark = "#A54C5F",
  accentSoft = "#FBECEE",
  inkColor = "#3B3540",
  inkMuted = "#6B6570",
  cardBg = "#FFFFFF",
  border = "#F3D2D8",
  isDarkMode = false,
  onOpenSettings,
}: GreetingProps) {
  const [timeGreeting, setTimeGreeting] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Client-only: derive time-of-day greeting on mount
  useEffect(() => {
    const hours = new Date().getHours();
    setTimeGreeting(getTimeGreeting(hours));
    setMounted(true);
  }, []);

  const displayName = name?.trim() ? name.trim() : "there";

  return (
    <div
      className={`w-full flex items-center justify-between ${GREETING_CONFIG.paddingX} ${GREETING_CONFIG.paddingY}`}
    >
      {/* ── Left: greeting text ── */}
      <div className="flex flex-col gap-0.5">
        {/* Time-of-day label */}
        <span
          className={`${GREETING_CONFIG.greetingLabelSize} font-body tracking-wide`}
          style={{
            color: inkMuted,
            opacity: mounted ? 1 : 0,
            transition: `opacity ${GREETING_CONFIG.transitionDuration}ms ease-out`,
          }}
        >
          {mounted ? timeGreeting : "\u00A0"}
        </span>

        {/* Main headline */}
        <h1
          className={`${GREETING_CONFIG.headlineSize} font-sans font-semibold tracking-tight leading-tight`}
          style={{ color: inkColor }}
        >
          Ready to prep,{" "}
          <span style={{ color: accentDark }}>{displayName}</span>?
        </h1>
      </div>

      {/* ── Right: settings pill ── */}
      <button
        onClick={onOpenSettings}
        aria-label="Open Theme Settings"
        className={`
          flex items-center justify-center gap-2
          px-3 py-2 min-h-[44px] min-w-[44px]
          ${GREETING_CONFIG.pillBorderRadius}
          border backdrop-blur-md
          transition-all active:scale-95 shadow-sm shrink-0
        `}
        style={{
          backgroundColor: isDarkMode ? `${cardBg}CC` : `${cardBg}E6`,
          borderColor: border,
          color: inkColor,
        }}
      >
        <Settings
          style={{ color: accentDark }}
          width={GREETING_CONFIG.iconSize}
          height={GREETING_CONFIG.iconSize}
        />
        {/* Theme color swatch dot */}
        <span
          className={`${GREETING_CONFIG.swatchSize} rounded-full border border-black/10 shrink-0`}
          style={{ backgroundColor: accentColor }}
        />
      </button>
    </div>
  );
}
