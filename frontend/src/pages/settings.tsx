import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft, Check } from "lucide-react";
import ColourPallete from "@/components/colourPallete";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const router = useRouter();
  const { colors, isDarkMode, activeProfile } = useTheme();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/studentWorkspace");
    }
  };

  return (
    <>
      <Head>
        <title>Settings · Studify</title>
        <meta
          name="description"
          content="Customize your Studify experience, appearance mode, and color palette."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full min-h-screen min-h-[100dvh] flex flex-col justify-between transition-colors duration-300 font-sans"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        <div>
          {/* ── Top Navigation Bar ── */}
          <header
            className="sticky top-0 z-20 w-full backdrop-blur-md border-b px-4 sm:px-6 py-3 transition-colors duration-300"
            style={{
              backgroundColor: isDarkMode ? `${colors.cardBg}E6` : `${colors.cardBg}CC`,
              borderColor: colors.border,
            }}
          >
            <div className="max-w-xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                aria-label="Back"
                className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 rounded-2xl border transition-all active:scale-95"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.ink,
                }}
              >
                <ArrowLeft className="w-5 h-5" style={{ color: colors.accentDark }} />
              </button>

              <div className="flex flex-col items-center">
                <span className="text-base font-semibold font-sans tracking-tight">
                  Settings
                </span>
                <span className="text-[11px] font-body opacity-60">
                  Appearance &amp; Preferences
                </span>
              </div>

              {/* Visual active swatch dot */}
              <div className="min-w-[44px] flex justify-end">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: activeProfile.light.accent }}
                />
              </div>
            </div>
          </header>

          {/* ── Main Content Container ── */}
          <main className="w-full max-w-xl mx-auto px-4 sm:px-6 py-6 pb-8 flex flex-col gap-6">
            <div>
              <h2
                className="text-sm sm:text-base font-sans font-medium"
                style={{ color: colors.inkMuted }}
              >
                Customize your study environment
              </h2>
            </div>

            {/* ── Wired Colour Pallete Component (Instant preview, no hex codes) ── */}
            <section>
              <ColourPallete />
            </section>
          </main>
        </div>

        {/* ── Sticky Pinned Bottom Action (Always reachable by thumb) ── */}
        <div
          className="sticky bottom-0 inset-x-0 w-full p-4 border-t backdrop-blur-xl transition-colors duration-300 flex justify-center pb-[calc(1rem+env(safe-area-inset-bottom))]"
          style={{
            backgroundColor: isDarkMode ? `${colors.cardBg}F0` : `${colors.cardBg}E6`,
            borderColor: colors.border,
          }}
        >
          <div className="w-full max-w-xl">
            <button
              type="button"
              onClick={handleBack}
              className="w-full min-h-[46px] py-2.5 rounded-2xl text-xs sm:text-sm font-sans font-semibold tracking-wide transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.accentDark,
                color: "#FFFFFF",
                boxShadow: `0 4px 16px ${colors.accent}66`,
              }}
            >
              <Check className="w-4 h-4" />
              <span>Return to Workspace</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
