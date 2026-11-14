import Head from "next/head";
import { useState } from "react";
import { Settings, X, Sun, Moon, Check, Sparkles } from "lucide-react";
import WelcomeHero from "@/components/welcomeHero";
import MuralIllustration from "@/components/muralIllustration";

interface ColorProfile {
  id: string;
  name: string;
  tagline: string;
  light: {
    pageBg: string;
    accent: string;
    accentSoft: string;
    accentDark: string;
    cardBg: string;
    border: string;
    ink: string;
    inkMuted: string;
  };
  dark: {
    pageBg: string;
    accent: string;
    accentSoft: string;
    accentDark: string;
    cardBg: string;
    border: string;
    ink: string;
    inkMuted: string;
  };
}

const COLOR_PROFILES: ColorProfile[] = [
  {
    id: "blush-rose",
    name: "Blush Rose",
    tagline: "Soft, warm, delicate rose with gentle warmth",
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
    tagline: "Calming, herbal, natural muted green",
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
    tagline: "Quiet, intellectual, soothing floral violet",
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
    tagline: "Airy, clear, gentle pastel sky blue",
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
    tagline: "Warm parchment, sunny and inviting",
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
    tagline: "Gentle citrus blush, soft and optimistic",
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
    tagline: "Cool slate, calm, focused morning rain",
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

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>("blush-rose");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const activeProfile =
    COLOR_PROFILES.find((p) => p.id === selectedId) || COLOR_PROFILES[0];
  const colors = isDarkMode ? activeProfile.dark : activeProfile.light;

  return (
    <>
      <Head>
        <title>Studify · MAKAUT Study Platform</title>
        <meta
          name="description"
          content="Calm, focused, marks-aligned study platform for MAKAUT students."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen relative flex flex-col justify-between overflow-x-hidden transition-colors duration-300 font-sans"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        {/* Top Header with Setting Icon */}
        <header
          className="w-full border-b backdrop-blur-md sticky top-0 z-30 transition-colors"
          style={{
            backgroundColor: isDarkMode ? `${colors.pageBg}E6` : `${colors.cardBg}CC`,
            borderColor: colors.border,
          }}
        >
          <div className="max-w-md sm:max-w-2xl md:max-w-3xl mx-auto px-4 py-3 sm:px-6 sm:py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm"
                style={{
                  backgroundColor: colors.accent,
                  color: isDarkMode ? "#181315" : colors.ink,
                }}
              >
                S
              </span>
              <div>
                <span className="font-semibold text-base sm:text-lg tracking-tight">Studify</span>
                <span className="text-[11px] ml-1.5 opacity-60 font-mono">MAKAUT</span>
              </div>
            </div>

            {/* Top-Right Touch-Friendly Settings Icon */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Theme Settings"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border transition-all active:scale-95 shadow-sm"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <Settings className="w-4 h-4" style={{ color: colors.accentDark }} />
              <span className="text-xs font-medium hidden sm:inline">Theme</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: activeProfile.light.accent }}
              />
            </button>
          </div>
        </header>

        {/* Main Hero Container */}
        <main className="flex-1 w-full flex flex-col justify-center items-center relative z-10 my-auto py-6 sm:py-10">
          <WelcomeHero
            accentColor={colors.accent}
            accentDark={colors.accentDark}
            accentSoft={colors.accentSoft}
            inkColor={colors.ink}
            inkMuted={colors.inkMuted}
          />
        </main>

        {/* Mountain Mural Illustration at Full Width of Mobile Screen from Bottom */}
        <footer className="w-full relative z-0 mt-auto">
          <MuralIllustration />
        </footer>

        {/* Theme Settings Drawer / Bottom Sheet */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-stretch sm:justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSettingsOpen(false)}
            />

            {/* Bottom Sheet on Mobile / Side Drawer on Desktop */}
            <div
              className="relative w-full sm:max-w-md max-h-[85vh] sm:max-h-full sm:h-full rounded-t-3xl sm:rounded-none shadow-2xl p-5 sm:p-7 flex flex-col justify-between overflow-y-auto border-t sm:border-t-0 sm:border-l transition-transform animate-in slide-in-from-bottom sm:slide-in-from-right duration-300"
              style={{
                backgroundColor: colors.pageBg,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              {/* Mobile Grab Handle Bar */}
              <div className="w-12 h-1.5 rounded-full bg-current opacity-20 mx-auto -mt-1 mb-4 sm:hidden shrink-0" />

              <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" style={{ color: colors.accentDark }} />
                    <h2 className="text-base sm:text-lg font-medium tracking-tight">Colour Profiles</h2>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    aria-label="Close Settings"
                    className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border transition-all active:scale-95"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Light / Dark Mode Switch */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
                    Mode
                  </label>
                  <div
                    className="grid grid-cols-2 p-1 rounded-2xl border transition-colors"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl transition-all"
                      style={
                        !isDarkMode
                          ? { backgroundColor: colors.accent, color: colors.ink }
                          : { color: colors.inkMuted }
                      }
                    >
                      <Sun className="w-3.5 h-3.5" />
                      <span>Soft Pastel (Light)</span>
                    </button>
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className="min-h-[40px] flex items-center justify-center gap-1.5 text-xs font-medium rounded-xl transition-all"
                      style={
                        isDarkMode
                          ? { backgroundColor: colors.accent, color: "#181315" }
                          : { color: colors.inkMuted }
                      }
                    >
                      <Moon className="w-3.5 h-3.5" />
                      <span>Tinted Dark</span>
                    </button>
                  </div>
                </div>

                {/* 7 Color Profiles Grid */}
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
                    Choose Palette (7 Profiles)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {COLOR_PROFILES.map((profile) => {
                      const isSelected = profile.id === selectedId;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => setSelectedId(profile.id)}
                          className="min-h-[50px] w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all active:scale-[0.99]"
                          style={{
                            backgroundColor: isSelected
                              ? colors.cardBg
                              : isDarkMode
                              ? "#1C1F24"
                              : "#FFFFFF80",
                            borderColor: isSelected ? colors.accent : colors.border,
                            boxShadow: isSelected
                              ? `0 2px 10px -2px ${colors.accent}40`
                              : "none",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                              style={{ backgroundColor: profile.light.accent }}
                            />
                            <div>
                              <div className="text-xs font-medium">{profile.name}</div>
                              <div className="text-[11px] opacity-65 font-body">{profile.tagline}</div>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="w-4 h-4 shrink-0" style={{ color: colors.accentDark }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Hex Tokens */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] uppercase tracking-wider font-semibold opacity-60">
                    Palette Hex Tokens
                  </label>
                  <div
                    className="p-3 rounded-2xl border text-[11px] font-mono grid grid-cols-2 gap-2"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <div>
                      <span className="opacity-50">bg: </span>
                      <span>{colors.pageBg}</span>
                    </div>
                    <div>
                      <span className="opacity-50">accent: </span>
                      <span>{colors.accent}</span>
                    </div>
                    <div>
                      <span className="opacity-50">card: </span>
                      <span>{colors.cardBg}</span>
                    </div>
                    <div>
                      <span className="opacity-50">border: </span>
                      <span>{colors.border}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="min-h-[44px] w-full py-2.5 rounded-2xl text-xs font-medium transition-transform active:scale-[0.98] shadow-sm flex items-center justify-center"
                  style={{
                    backgroundColor: colors.accent,
                    color: isDarkMode ? "#181315" : colors.ink,
                  }}
                >
                  Apply & Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
