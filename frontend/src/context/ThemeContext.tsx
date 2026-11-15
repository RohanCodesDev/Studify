"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface ThemeColors {
  pageBg: string;
  accent: string;
  accentSoft: string;
  accentDark: string;
  cardBg: string;
  border: string;
  ink: string;
  inkMuted: string;
}

export interface ColorProfile {
  id: string;
  name: string;
  tagline: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const COLOR_PROFILES: ColorProfile[] = [
  {
    id: "blush-rose",
    name: "Blush Rose",
    tagline: "Soft, delicate rose with gentle warmth",
    light: {
      pageBg: "#FCF5F4",
      accent: "#E7A9B5",
      accentSoft: "#FBECEE",
      accentDark: "#A54C5F",
      cardBg: "#FFFFFF",
      border: "#F3D2D8",
      ink: "#3B3540",
      inkMuted: "#6B6570",
    },
    dark: {
      pageBg: "#181315",
      accent: "#E7A9B5",
      accentSoft: "#2A1D21",
      accentDark: "#F2C7D0",
      cardBg: "#221A1E",
      border: "#3D2B32",
      ink: "#F7EEF0",
      inkMuted: "#B8ABB0",
    },
  },
  {
    id: "sage-mist",
    name: "Sage Mist",
    tagline: "Calming, herbal muted green",
    light: {
      pageBg: "#F4F7F2",
      accent: "#A9C5A7",
      accentSoft: "#E7F0E6",
      accentDark: "#4D764A",
      cardBg: "#FFFFFF",
      border: "#CFE0CE",
      ink: "#3B3540",
      inkMuted: "#636A63",
    },
    dark: {
      pageBg: "#131713",
      accent: "#A9C5A7",
      accentSoft: "#1B261B",
      accentDark: "#C7DEC5",
      cardBg: "#1C241D",
      border: "#2F3E30",
      ink: "#EEF4EE",
      inkMuted: "#A9B4AA",
    },
  },
  {
    id: "lavender-haze",
    name: "Lavender Haze",
    tagline: "Quiet, soothing floral violet",
    light: {
      pageBg: "#F6F4FB",
      accent: "#B9ABE3",
      accentSoft: "#EFEBF8",
      accentDark: "#63509C",
      cardBg: "#FFFFFF",
      border: "#DDD5F4",
      ink: "#3B3540",
      inkMuted: "#676373",
    },
    dark: {
      pageBg: "#15131B",
      accent: "#B9ABE3",
      accentSoft: "#221C2F",
      accentDark: "#D5CBF5",
      cardBg: "#1E1A27",
      border: "#352C46",
      ink: "#F2EFF9",
      inkMuted: "#B2ABC2",
    },
  },
  {
    id: "sky-whisper",
    name: "Sky Whisper",
    tagline: "Clear, gentle pastel sky blue",
    light: {
      pageBg: "#F2F7FB",
      accent: "#A5C8E8",
      accentSoft: "#E2F0FB",
      accentDark: "#45729C",
      cardBg: "#FFFFFF",
      border: "#CBE0F3",
      ink: "#3B3540",
      inkMuted: "#616A74",
    },
    dark: {
      pageBg: "#12161A",
      accent: "#A5C8E8",
      accentSoft: "#19242F",
      accentDark: "#C4DEFA",
      cardBg: "#192027",
      border: "#293745",
      ink: "#EEF4F9",
      inkMuted: "#A7B3BE",
    },
  },
  {
    id: "butter-cream",
    name: "Butter Cream",
    tagline: "Warm parchment, sunny and gentle",
    light: {
      pageBg: "#FBF8EE",
      accent: "#E8D08E",
      accentSoft: "#F9F3DC",
      accentDark: "#947A33",
      cardBg: "#FFFFFF",
      border: "#F2E5BA",
      ink: "#3B3540",
      inkMuted: "#6B675B",
    },
    dark: {
      pageBg: "#181711",
      accent: "#E8D08E",
      accentSoft: "#282417",
      accentDark: "#F3E3B6",
      cardBg: "#232016",
      border: "#3B3623",
      ink: "#FAF6EA",
      inkMuted: "#B8B3A2",
    },
  },
  {
    id: "peach-glow",
    name: "Peach Glow",
    tagline: "Soft citrus blush, warm and calm",
    light: {
      pageBg: "#FDF5EF",
      accent: "#F0B79A",
      accentSoft: "#FCE8DC",
      accentDark: "#A85731",
      cardBg: "#FFFFFF",
      border: "#F7D4C2",
      ink: "#3B3540",
      inkMuted: "#6F635C",
    },
    dark: {
      pageBg: "#191411",
      accent: "#F0B79A",
      accentSoft: "#2B1E17",
      accentDark: "#F7D1BF",
      cardBg: "#241B16",
      border: "#3E2D23",
      ink: "#FBF3EE",
      inkMuted: "#B8ACA3",
    },
  },
  {
    id: "november-rain",
    name: "November Rain",
    tagline: "Cool slate, calm and focused",
    light: {
      pageBg: "#F0F3F6",
      accent: "#9DB2C7",
      accentSoft: "#DFE7EE",
      accentDark: "#48627B",
      cardBg: "#FFFFFF",
      border: "#C7D6E3",
      ink: "#3B3540",
      inkMuted: "#616870",
    },
    dark: {
      pageBg: "#121518",
      accent: "#9DB2C7",
      accentSoft: "#1B2229",
      accentDark: "#C1D1E0",
      cardBg: "#191E23",
      border: "#29333C",
      ink: "#EEF2F6",
      inkMuted: "#A6B0BA",
    },
  },
];

interface ThemeContextType {
  selectedId: string;
  setSelectedId: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  activeProfile: ColorProfile;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_THEME_KEY = "studify_theme_palette";
const STORAGE_DARK_KEY = "studify_theme_dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [selectedId, setSelectedIdState] = useState<string>("blush-rose");
  const [isDarkMode, setIsDarkModeState] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load saved preferences on client mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_THEME_KEY);
      if (savedTheme && COLOR_PROFILES.some((p) => p.id === savedTheme)) {
        setSelectedIdState(savedTheme);
      }
      const savedDark = localStorage.getItem(STORAGE_DARK_KEY);
      if (savedDark !== null) {
        setIsDarkModeState(savedDark === "true");
      }
    } catch {
      // LocalStorage access may fail in some environments
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const setSelectedId = (id: string) => {
    setSelectedIdState(id);
    try {
      localStorage.setItem(STORAGE_THEME_KEY, id);
    } catch {
      // ignore
    }
  };

  const setIsDarkMode = (value: boolean | ((prev: boolean) => boolean)) => {
    setIsDarkModeState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      try {
        localStorage.setItem(STORAGE_DARK_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const activeProfile =
    COLOR_PROFILES.find((p) => p.id === selectedId) || COLOR_PROFILES[0];
  const colors = isDarkMode ? activeProfile.dark : activeProfile.light;

  return (
    <ThemeContext.Provider
      value={{
        selectedId,
        setSelectedId,
        isDarkMode,
        setIsDarkMode,
        activeProfile,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    const fallbackProfile = COLOR_PROFILES[0];
    return {
      selectedId: "blush-rose",
      setSelectedId: () => {},
      isDarkMode: false,
      setIsDarkMode: () => {},
      activeProfile: fallbackProfile,
      colors: fallbackProfile.light,
    };
  }
  return context;
}
