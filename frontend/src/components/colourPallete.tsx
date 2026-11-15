"use client";

import React from "react";
import { Sun, Moon, Check, Sparkles } from "lucide-react";
import {
  useTheme,
  COLOR_PROFILES,
  ColorProfile,
  ThemeColors,
} from "@/context/ThemeContext";

// Re-export types & constants for external consumers
export { COLOR_PROFILES };
export type { ColorProfile, ThemeColors };

// ─── Tweakable configuration ───────────────────────────────────────────────
export const COLOUR_PALLETE_CONFIG = {
  cardBorderRadius: "rounded-2xl",
  buttonMinHeight: "52px",
  toggleMinHeight: "42px",
  swatchSize: "w-4 h-4",
  tokenBoxBorderRadius: "rounded-2xl",
};

interface ColourPalleteProps {
  className?: string;
  showHexTokens?: boolean;
}

export default function ColourPallete({
  className = "",
  showHexTokens = true,
}: ColourPalleteProps) {
  const {
    selectedId,
    setSelectedId,
    isDarkMode,
    setIsDarkMode,
    colors,
  } = useTheme();

  return (
    <div className={`w-full flex flex-col gap-6 ${className}`}>
      {/* ── Mode Switcher: Soft Pastel vs Tinted Dark ── */}
      <div className="space-y-2">
        <label
          className="text-[11px] uppercase tracking-wider font-semibold opacity-60 font-sans"
          style={{ color: colors.ink }}
        >
          Appearance Mode
        </label>
        <div
          className={`grid grid-cols-2 p-1.5 ${COLOUR_PALLETE_CONFIG.cardBorderRadius} border transition-colors`}
          style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
        >
          <button
            type="button"
            onClick={() => setIsDarkMode(false)}
            className={`min-h-[${COLOUR_PALLETE_CONFIG.toggleMinHeight}] flex items-center justify-center gap-2 text-xs font-sans font-medium rounded-xl transition-all duration-200 active:scale-95`}
            style={
              !isDarkMode
                ? {
                    backgroundColor: colors.accent,
                    color: colors.ink,
                    boxShadow: `0 2px 8px ${colors.accent}40`,
                  }
                : { color: colors.inkMuted }
            }
          >
            <Sun className="w-4 h-4" />
            <span>Soft Pastel (Light)</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDarkMode(true)}
            className={`min-h-[${COLOUR_PALLETE_CONFIG.toggleMinHeight}] flex items-center justify-center gap-2 text-xs font-sans font-medium rounded-xl transition-all duration-200 active:scale-95`}
            style={
              isDarkMode
                ? {
                    backgroundColor: colors.accent,
                    color: "#181315",
                    boxShadow: `0 2px 8px ${colors.accent}40`,
                  }
                : { color: colors.inkMuted }
            }
          >
            <Moon className="w-4 h-4" />
            <span>Tinted Dark</span>
          </button>
        </div>
      </div>

      {/* ── 7 Color Profiles Grid ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label
            className="text-[11px] uppercase tracking-wider font-semibold opacity-60 font-sans"
            style={{ color: colors.ink }}
          >
            Choose Palette (7 Profiles)
          </label>
          <span
            className="text-[11px] font-body opacity-50"
            style={{ color: colors.inkMuted }}
          >
            Instant preview
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {COLOR_PROFILES.map((profile) => {
            const isSelected = profile.id === selectedId;
            const profileAccent = profile.light.accent;

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => setSelectedId(profile.id)}
                className={`
                  w-full flex items-center justify-between p-3.5
                  ${COLOUR_PALLETE_CONFIG.cardBorderRadius} border text-left
                  transition-all duration-200 active:scale-[0.99]
                `}
                style={{
                  minHeight: COLOUR_PALLETE_CONFIG.buttonMinHeight,
                  backgroundColor: isSelected
                    ? colors.cardBg
                    : isDarkMode
                      ? "#1C1F24"
                      : "#FFFFFF80",
                  borderColor: isSelected ? colors.accent : colors.border,
                  boxShadow: isSelected
                    ? `0 4px 14px -2px ${colors.accent}4D`
                    : "none",
                }}
              >
                <div className="flex items-center gap-3.5">
                  {/* Color swatch dot */}
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`${COLOUR_PALLETE_CONFIG.swatchSize} rounded-full border border-black/15 shrink-0 transition-transform duration-200`}
                      style={{
                        backgroundColor: profileAccent,
                        transform: isSelected ? "scale(1.15)" : "scale(1)",
                      }}
                    />
                  </div>

                  {/* Profile info */}
                  <div>
                    <div
                      className="text-sm font-medium font-sans tracking-tight"
                      style={{ color: colors.ink }}
                    >
                      {profile.name}
                    </div>
                    <div
                      className="text-xs font-body opacity-65"
                      style={{ color: colors.inkMuted }}
                    >
                      {profile.tagline}
                    </div>
                  </div>
                </div>

                {/* Selected check indicator */}
                {isSelected && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 border transition-transform animate-in zoom-in-75 duration-150"
                    style={{
                      backgroundColor: colors.accentSoft,
                      borderColor: colors.accent,
                    }}
                  >
                    <Check
                      className="w-4 h-4"
                      style={{ color: colors.accentDark }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active Hex Tokens (Grounding preview) ── */}
      {showHexTokens && (
        <div className="space-y-1.5 pt-1">
          <label
            className="text-[11px] uppercase tracking-wider font-semibold opacity-60 font-sans"
            style={{ color: colors.ink }}
          >
            Active Palette Tokens
          </label>
          <div
            className={`p-3.5 ${COLOUR_PALLETE_CONFIG.tokenBoxBorderRadius} border text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-2.5 transition-colors`}
            style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: colors.pageBg }}
              />
              <span className="opacity-50">bg:</span>
              <span style={{ color: colors.ink }}>{colors.pageBg}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: colors.accent }}
              />
              <span className="opacity-50">accent:</span>
              <span style={{ color: colors.ink }}>{colors.accent}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: colors.cardBg }}
              />
              <span className="opacity-50">card:</span>
              <span style={{ color: colors.ink }}>{colors.cardBg}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: colors.border }}
              />
              <span className="opacity-50">border:</span>
              <span style={{ color: colors.ink }}>{colors.border}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
