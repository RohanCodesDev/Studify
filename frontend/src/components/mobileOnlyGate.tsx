"use client";

import React from "react";
import { Smartphone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface MobileOnlyGateProps {
  children: React.ReactNode;
}

export default function MobileOnlyGate({ children }: MobileOnlyGateProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* ── Mobile Viewport: Real Studify app on mobile screens (< 768px) ── */}
      <div className="block md:hidden min-h-screen min-h-[100dvh] w-full">
        {children}
      </div>

      {/* ── Desktop Viewport: Barrier screen on desktop screens (>= 768px) ── */}
      <aside
        aria-label="Desktop Device Notice"
        className="hidden md:flex min-h-screen min-h-[100dvh] w-full flex-col items-center justify-center p-6 text-center select-none font-sans transition-colors duration-300"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        <div
          className="max-w-md w-full p-8 sm:p-10 rounded-3xl border shadow-xl flex flex-col items-center gap-5 transition-all"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.border,
            boxShadow: `0 20px 40px -15px ${colors.accent}40`,
          }}
        >
          {/* Subtle phone icon badge with theme accent */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: colors.accent,
              color: colors.accentDark,
            }}
          >
            <Smartphone className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span
              className="text-xs uppercase tracking-wider font-semibold font-sans opacity-70"
              style={{ color: colors.accentDark }}
            >
              Mobile Only
            </span>
            <h1 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">
              Studify
            </h1>
            <p
              className="text-sm sm:text-base font-body leading-relaxed max-w-sm mx-auto"
              style={{ color: colors.inkMuted }}
            >
              This application has been designed only for mobile screens. Please come back using your mobile
            </p>
          </div>

          <div
            className="px-4 py-2 rounded-xl text-xs font-sans font-medium border"
            style={{
              backgroundColor: colors.accentSoft,
              borderColor: `${colors.accent}66`,
              color: colors.accentDark,
            }}
          >
            Tip: Switch to mobile view in DevTools to preview
          </div>
        </div>
      </aside>
    </>
  );
}
