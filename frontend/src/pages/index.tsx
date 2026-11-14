import Head from "next/head";
import { useState } from "react";

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

  const activeProfile =
    COLOR_PROFILES.find((p) => p.id === selectedId) || COLOR_PROFILES[0];
  const colors = isDarkMode ? activeProfile.dark : activeProfile.light;

  return (
    <>
      <Head>
        <title>Studify · Base Colour Profiles</title>
        <meta
          name="description"
          content="Explore and test the 7 pastel colour profiles for Studify."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="min-h-screen transition-colors duration-300 font-sans p-6 md:p-12 flex flex-col items-center"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        <div className="w-full max-w-4xl space-y-8">
          {/* Top Controls: Profile Switcher & Mode Toggle */}
          <header className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b"
              style={{ borderColor: colors.border }}
            >
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: colors.accentDark }}>
                  Colour Profiler
                </span>
                <h1 className="text-2xl md:text-3xl font-light tracking-tight mt-0.5">
                  Select Base Palette
                </h1>
              </div>

              {/* Light / Dark Mode Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: colors.inkMuted }}>
                  Mode:
                </span>
                <div
                  className="inline-flex p-1 rounded-full border transition-colors"
                  style={{ backgroundColor: colors.cardBg, borderColor: colors.border }}
                >
                  <button
                    onClick={() => setIsDarkMode(false)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                      !isDarkMode ? "shadow-sm" : "opacity-60 hover:opacity-100"
                    }`}
                    style={
                      !isDarkMode
                        ? { backgroundColor: colors.accent, color: colors.ink }
                        : {}
                    }
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setIsDarkMode(true)}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-all ${
                      isDarkMode ? "shadow-sm" : "opacity-60 hover:opacity-100"
                    }`}
                    style={
                      isDarkMode
                        ? { backgroundColor: colors.accent, color: "#181315" }
                        : {}
                    }
                  >
                    Dark (Tinted)
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Buttons Pill Bar */}
            <div className="flex flex-wrap gap-2 pt-2">
              {COLOR_PROFILES.map((profile) => {
                const isSelected = profile.id === selectedId;
                const dotColor = profile.light.accent;
                return (
                  <button
                    key={profile.id}
                    onClick={() => setSelectedId(profile.id)}
                    className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all border"
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
                      transform: isSelected ? "translateY(-1px)" : "none",
                    }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: dotColor }}
                    />
                    <span>{profile.name}</span>
                  </button>
                );
              })}
            </div>
          </header>

          {/* Active Profile Banner */}
          <div
            className="p-6 rounded-2xl border transition-colors space-y-2"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: colors.accentSoft, color: colors.accentDark }}
              >
                <span>Active Profile</span>
                <span className="font-semibold">· {activeProfile.name}</span>
              </div>
              <span className="text-xs font-mono" style={{ color: colors.inkMuted }}>
                {isDarkMode ? "Tinted Dark" : "Soft Pastel"}
              </span>
            </div>
            <p className="font-body text-base md:text-lg" style={{ color: colors.ink }}>
              {activeProfile.tagline}
            </p>
          </div>

          {/* Color Tokens Matrix */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: colors.inkMuted }}>
              Palette Tokens
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { label: "Page Background", val: colors.pageBg },
                { label: "Primary Accent", val: colors.accent },
                { label: "Soft Accent Fill", val: colors.accentSoft },
                { label: "Deep Accent", val: colors.accentDark },
                { label: "Card Surface", val: colors.cardBg },
                { label: "Hairline Border", val: colors.border },
                { label: "Primary Ink", val: colors.ink },
                { label: "Muted Ink", val: colors.inkMuted },
              ].map((token) => (
                <div
                  key={token.label}
                  className="p-3.5 rounded-xl border flex flex-col justify-between h-24 transition-colors"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium" style={{ color: colors.inkMuted }}>
                      {token.label}
                    </span>
                    <span
                      className="w-4 h-4 rounded-md border border-black/10 shrink-0"
                      style={{ backgroundColor: token.val }}
                    />
                  </div>
                  <span className="text-xs font-mono font-semibold" style={{ color: colors.ink }}>
                    {token.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview: Typography & Components */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-semibold tracking-wide uppercase" style={{ color: colors.inkMuted }}>
              Component & Reading View Test
            </h2>

            <div
              className="p-6 md:p-8 rounded-2xl border transition-colors space-y-6"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <div className="space-y-2">
                <span
                  className="text-xs uppercase tracking-wider font-semibold"
                  style={{ color: colors.accentDark }}
                >
                  Heading (Urbanist) · Notes Body (Product Sans)
                </span>
                <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                  Relational Algebra: Selection & Projection
                </h3>
              </div>

              <div
                className="font-body text-base md:text-lg leading-relaxed max-w-2xl space-y-3"
                style={{ color: colors.ink }}
              >
                <p>
                  In relational algebra, the <strong>Selection</strong> operation (denoted by $\sigma$)
                  retrieves rows from a table that satisfy a given predicate condition. It acts as
                  a horizontal filter across tuples.
                </p>
                <p style={{ color: colors.inkMuted }}>
                  Meanwhile, <strong>Projection</strong> (denoted by $\pi$) filters vertically,
                  returning only designated column attributes while eliminating duplicate records.
                </p>
              </div>

              {/* Interactive Sample Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-transform active:scale-95 shadow-sm"
                  style={{
                    backgroundColor: colors.accent,
                    color: isDarkMode ? "#181315" : colors.ink,
                  }}
                >
                  Primary Action Button
                </button>

                <button
                  className="px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium transition-transform active:scale-95 border"
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.border,
                    color: colors.accentDark,
                  }}
                >
                  Soft Accent Button
                </button>

                <span
                  className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: isDarkMode ? "#1C241D" : "#EAF3E8",
                    borderColor: isDarkMode ? "#2E4730" : "#C7DEC5",
                    color: isDarkMode ? "#B8E2B4" : "#2E5929",
                  }}
                >
                  ✓ Gentle Correct State
                </span>

                <span
                  className="px-3 py-1.5 rounded-full text-xs font-medium border"
                  style={{
                    backgroundColor: isDarkMode ? "#281A1D" : "#FBECEE",
                    borderColor: isDarkMode ? "#4A2B33" : "#F3D2D8",
                    color: isDarkMode ? "#F0B5BF" : "#8C3A48",
                  }}
                >
                  • Gentle Review State
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
