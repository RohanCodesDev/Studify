"use client";

import React from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Home, BookOpen, GraduationCap, Calculator, User, LucideIcon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
}

export const BOTTOM_NAV_CONFIG = {
  buttonMinSize: "min-h-[44px] min-w-[48px]",
  iconSize: 20,
};

interface BottomNavProps {
  activeTab?: string;
  onChangeTab?: (id: string) => void;
  className?: string;
}

export default function BottomNav({
  activeTab,
  onChangeTab,
  className = "",
}: BottomNavProps) {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const navItems: NavItem[] = [
    {
      id: "home",
      icon: Home,
      label: "Home",
      href: "/studentWorkspace",
    },
    {
      id: "sessions",
      icon: BookOpen,
      label: "Sessions",
      href: "/sessions",
    },
    {
      id: "practice",
      icon: GraduationCap,
      label: "Practice",
      href: "/practice",
    },
    {
      id: "tools",
      icon: Calculator,
      label: "Tools",
      href: "/tools",
    },
    {
      id: "profile",
      icon: User,
      label: "Profile",
      href: "/profile",
    },
  ];

  // Auto-detect active tab from current route if not explicitly passed
  const currentTab =
    activeTab ||
    (router.pathname === "/studentWorkspace" || router.pathname === "/"
      ? "home"
      : router.pathname.replace("/", ""));

  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        "fixed bottom-3 sm:bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4",
        "pb-[env(safe-area-inset-bottom)]",
        className
      )}
    >
      <div className="pointer-events-auto">
        <div
          className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl backdrop-blur-xl border shadow-lg transition-colors duration-300"
          style={{
            backgroundColor: isDarkMode ? `${colors.cardBg}F0` : `${colors.cardBg}E6`,
            borderColor: colors.border,
            boxShadow: `0 8px 32px -4px ${colors.accent}33, 0 2px 10px -2px rgba(0,0,0,0.06)`,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (onChangeTab) {
                    onChangeTab(item.id);
                  }
                  if (router.pathname !== item.href) {
                    router.push(item.href);
                  }
                }}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative group flex flex-col items-center justify-center",
                  "px-3 py-1.5 rounded-xl select-none transition-colors duration-200",
                  BOTTOM_NAV_CONFIG.buttonMinSize
                )}
                style={{
                  color: isActive ? colors.accentDark : colors.inkMuted,
                }}
              >
                {/* Smooth sliding active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeDockPill"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: colors.accentSoft }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  width={BOTTOM_NAV_CONFIG.iconSize}
                  height={BOTTOM_NAV_CONFIG.iconSize}
                  className="relative z-10 transition-transform duration-200"
                />

                {/* Sub-label for thumb clarity */}
                <span className="relative z-10 text-[10px] font-sans font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="activeDockDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full z-10"
                    style={{ backgroundColor: colors.accentDark }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                {/* Tooltip on hover (desktop/mouse) */}
                <span
                  className={cn(
                    "absolute -top-9 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded-lg text-xs font-sans font-medium shadow-md",
                    "opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none sm:block hidden z-20"
                  )}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    borderWidth: 1,
                    color: colors.ink,
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
