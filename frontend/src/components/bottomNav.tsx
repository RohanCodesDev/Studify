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
  floatingDuration: 4,
  floatY: [-1.5, 1.5, -1.5],
  buttonMinSize: "min-h-[44px] min-w-[44px]",
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
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="pointer-events-auto"
      >
        <motion.div
          animate={{
            y: BOTTOM_NAV_CONFIG.floatY,
          }}
          transition={{
            duration: BOTTOM_NAV_CONFIG.floatingDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-2xl backdrop-blur-xl border shadow-lg transition-all duration-300"
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
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.94 }}
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
                  "px-3 py-2 rounded-xl transition-all duration-200 select-none",
                  BOTTOM_NAV_CONFIG.buttonMinSize
                )}
                style={{
                  backgroundColor: isActive ? colors.accentSoft : "transparent",
                  color: isActive ? colors.accentDark : colors.inkMuted,
                }}
              >
                <Icon
                  width={BOTTOM_NAV_CONFIG.iconSize}
                  height={BOTTOM_NAV_CONFIG.iconSize}
                  className="transition-transform duration-200"
                />

                {/* Sub-label for thumb clarity */}
                <span className="text-[10px] font-sans font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <motion.span
                    layoutId="activeDockDot"
                    className="absolute -bottom-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.accentDark }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}

                {/* Tooltip on hover (desktop/mouse) */}
                <span
                  className={cn(
                    "absolute -top-9 left-1/2 -translate-x-1/2",
                    "px-2 py-1 rounded-lg text-xs font-sans font-medium shadow-md",
                    "opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none sm:block hidden"
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
        </motion.div>
      </motion.div>
    </nav>
  );
}
