import Head from "next/head";
import { useRouter } from "next/router";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
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
        className="w-full min-h-screen min-h-[100dvh] flex flex-col transition-colors duration-300 font-sans"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
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

            {/* Visual spacer to balance the back button */}
            <div className="min-w-[44px] flex justify-end">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: activeProfile.light.accent }}
              />
            </div>
          </div>
        </header>

        {/* ── Main Content Container ── */}
        <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28 flex flex-col gap-6">
          {/* Section banner */}
          <div
            className="p-4 rounded-2xl border flex items-center gap-3 transition-colors shadow-sm"
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.border,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold font-sans">
                Study Environment
              </h2>
              <p
                className="text-xs font-body leading-relaxed"
                style={{ color: colors.inkMuted }}
              >
                Choose soft pastel tones designed for long reading comfort and focus.
              </p>
            </div>
          </div>

          {/* ── Wired Colour Pallete Component ── */}
          <section>
            <ColourPallete showHexTokens={true} />
          </section>

          {/* Action button */}
          <div className="pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="w-full min-h-[48px] py-3 rounded-2xl text-sm font-sans font-semibold tracking-wide transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.accentDark,
                color: "#FFFFFF",
                boxShadow: `0 4px 16px ${colors.accent}66`,
              }}
            >
              <Check className="w-4 h-4" />
              <span>Apply &amp; Return</span>
            </button>
          </div>
        </main>
      </div>
    </>
  );
}
