import Head from "next/head";
import { useState } from "react";
import { Settings, X, Sun, Moon, Check, Sparkles } from "lucide-react";

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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen transition-colors duration-300 font-sans flex flex-col items-center"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        {/* Top Navigation Bar */}
        <header
          className="w-full border-b backdrop-blur-md sticky top-0 z-30 transition-colors"
          style={{
            backgroundColor: isDarkMode ? `${colors.pageBg}E6` : `${colors.cardBg}B3`,
            borderColor: colors.border,
          }}
        >
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                <span className="font-semibold text-lg tracking-tight">Studify</span>
                <span className="text-xs ml-2 opacity-60 font-mono">MAKAUT</span>
              </div>
            </div>

            {/* Top Right: Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Theme Settings"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs md:text-sm font-medium border transition-all hover:scale-105 active:scale-95 shadow-sm"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <Settings className="w-4 h-4" style={{ color: colors.accentDark }} />
              <span className="hidden sm:inline">Theme Settings</span>
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: activeProfile.light.accent }}
              />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full max-w-4xl px-6 py-12 md:py-16 space-y-8 flex-1">
          {/* Subtle current mood indicator */}
          <div className="flex items-center justify-between">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.border,
                color: colors.accentDark,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Current Profile: <strong>{activeProfile.name}</strong> ({isDarkMode ? "Tinted Dark" : "Soft Pastel"})</span>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs underline underline-offset-4 font-medium transition-opacity hover:opacity-80"
              style={{ color: colors.accentDark }}
            >
              Change palette
            </button>
          </div>

          {/* Calm Study View Card */}
          <div
            className="p-8 md:p-10 rounded-3xl border shadow-sm transition-all space-y-6"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <div className="space-y-2">
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: colors.accentDark }}
              >
                Module 1 · Relational Data Model
              </span>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight">
                Entity-Relationship (ER) Modeling & Normalization
              </h1>
            </div>

            <div
              className="font-body text-lg leading-relaxed space-y-4"
              style={{ color: colors.ink }}
            >
              <p>
                An Entity-Relationship model describes interrelated things of interest in a
                specific domain of knowledge. A basic ER model is composed of entity types and
                specifies relationships that can exist between entities.
              </p>
              <p style={{ color: colors.inkMuted }}>
                In MAKAUT semester examinations, questions frequently test the transition from
                un-normalized schemas to Third Normal Form (3NF) and Boyce-Codd Normal Form (BCNF),
                demanding clear functional dependency proofs and lossless-join decompositions.
              </p>
            </div>

            {/* Sample Action Buttons & Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-3 border-t" style={{ borderColor: colors.border }}>
              <button
                className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-transform active:scale-95 shadow-sm"
                style={{
                  backgroundColor: colors.accent,
                  color: isDarkMode ? "#181315" : colors.ink,
                }}
              >
                15-Mark Model Answer
              </button>

              <button
                className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-transform active:scale-95 border"
                style={{
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.border,
                  color: colors.accentDark,
                }}
              >
                Syllabus Gap Report
              </button>

              <span
                className="px-3 py-1.5 rounded-full text-xs font-medium border"
                style={{
                  backgroundColor: isDarkMode ? "#1C241D" : "#EAF3E8",
                  borderColor: isDarkMode ? "#2E4730" : "#C7DEC5",
                  color: isDarkMode ? "#B8E2B4" : "#2E5929",
                }}
              >
                ✓ Appeared in 6 of last 8 papers
              </span>
            </div>
          </div>
        </main>

        {/* Settings Slide-Over Drawer / Modal */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSettingsOpen(false)}
            />

            {/* Drawer Panel */}
            <div
              className="relative w-full max-w-md h-full shadow-2xl p-6 md:p-8 flex flex-col justify-between overflow-y-auto border-l transition-transform animate-in slide-in-from-right duration-300"
              style={{
                backgroundColor: colors.pageBg,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <div className="space-y-6">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: colors.border }}>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" style={{ color: colors.accentDark }} />
                    <h2 className="text-lg font-medium tracking-tight">Theme & Palette</h2>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(false)}
                    aria-label="Close Settings"
                    className="p-1.5 rounded-lg border transition-all hover:opacity-75"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Light / Dark Mode Switch */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: colors.inkMuted }}>
                    Appearance Mode
                  </label>
                  <div
                    className="grid grid-cols-2 p-1 rounded-xl border transition-colors"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className="flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all"
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
                      className="flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-lg transition-all"
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
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: colors.inkMuted }}>
                    Select Colour Mood (7 Profiles)
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {COLOR_PROFILES.map((profile) => {
                      const isSelected = profile.id === selectedId;
                      return (
                        <button
                          key={profile.id}
                          onClick={() => setSelectedId(profile.id)}
                          className="w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all"
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

                {/* Token Values Inspector */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs uppercase tracking-wider font-semibold" style={{ color: colors.inkMuted }}>
                    Active Hex Values
                  </label>
                  <div
                    className="p-3.5 rounded-xl border text-xs font-mono space-y-1.5"
                    style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                  >
                    <div className="flex justify-between">
                      <span style={{ color: colors.inkMuted }}>pageBg:</span>
                      <span>{colors.pageBg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.inkMuted }}>accent:</span>
                      <span>{colors.accent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.inkMuted }}>cardBg:</span>
                      <span>{colors.cardBg}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.inkMuted }}>border:</span>
                      <span>{colors.border}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: colors.inkMuted }}>ink:</span>
                      <span>{colors.ink}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Drawer Action */}
              <div className="pt-6 border-t mt-6" style={{ borderColor: colors.border }}>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-2.5 rounded-xl text-xs font-medium transition-transform active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: colors.accent,
                    color: isDarkMode ? "#181315" : colors.ink,
                  }}
                >
                  Apply & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
