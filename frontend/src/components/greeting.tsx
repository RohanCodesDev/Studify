"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Settings } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

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
  accentColor,
  accentDark,
  accentSoft,
  inkColor,
  inkMuted,
  cardBg,
  border,
  isDarkMode: propDarkMode,
  onOpenSettings,
}: GreetingProps) {
  const router = useRouter();
  const theme = useTheme();

  // Fallback to theme context if props are omitted
  const activeAccent = accentColor ?? theme.colors.accent;
  const activeAccentDark = accentDark ?? theme.colors.accentDark;
  const activeInk = inkColor ?? theme.colors.ink;
  const activeInkMuted = inkMuted ?? theme.colors.inkMuted;
  const activeCardBg = cardBg ?? theme.colors.cardBg;
  const activeBorder = border ?? theme.colors.border;
  const activeDarkMode = propDarkMode ?? theme.isDarkMode;

  const [timeGreeting, setTimeGreeting] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Client-only: derive time-of-day greeting on mount
  useEffect(() => {
    const hours = new Date().getHours();
    setTimeGreeting(getTimeGreeting(hours));
    setMounted(true);
  }, []);

  const handleSettingsClick = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      router.push("/settings");
    }
  };

  const hasName = Boolean(name && name.trim().length > 0);

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
            color: activeInkMuted,
            opacity: mounted ? 1 : 0,
            transition: `opacity ${GREETING_CONFIG.transitionDuration}ms ease-out`,
          }}
        >
          {mounted ? timeGreeting : "\u00A0"}
        </span>

        {/* Main headline: clean and natural with editorial italic accent */}
        <h1
          className={`${GREETING_CONFIG.headlineSize} font-sans font-semibold tracking-tight leading-tight`}
          style={{ color: activeInk }}
        >
          {hasName ? (
            <>
              Ready to{" "}
              <em className="italic font-bold" style={{ color: activeAccentDark }}>
                prep
              </em>
              , {name!.trim()}?
            </>
          ) : (
            <>
              Ready to{" "}
              <em className="italic font-bold" style={{ color: activeAccentDark }}>
                prep
              </em>
              ?
            </>
          )}
        </h1>
      </div>

      {/* ── Right: settings pill ── */}
      <button
        onClick={handleSettingsClick}
        aria-label="Open Theme Settings"
        className={`
          flex items-center justify-center gap-2
          px-3 py-2 min-h-[44px] min-w-[44px]
          ${GREETING_CONFIG.pillBorderRadius}
          border backdrop-blur-md
          transition-all active:scale-95 shadow-sm shrink-0
        `}
        style={{
          backgroundColor: activeDarkMode ? `${activeCardBg}CC` : `${activeCardBg}E6`,
          borderColor: activeBorder,
          color: activeInk,
        }}
      >
        <Settings
          style={{ color: activeAccentDark }}
          width={GREETING_CONFIG.iconSize}
          height={GREETING_CONFIG.iconSize}
        />
        {/* Theme color swatch dot */}
        <span
          className={`${GREETING_CONFIG.swatchSize} rounded-full border border-black/10 shrink-0`}
          style={{ backgroundColor: activeAccent }}
        />
      </button>
    </div>
  );
}
