import React from "react";
import { ArrowRight, HelpCircle } from "lucide-react";

/**
 * -----------------------------------------------------------------------
 * CTA BUTTONS CONFIGURATION
 * Tweak these variables to adjust button sizing, padding, and gap easily!
 * -----------------------------------------------------------------------
 */
export const CTA_CONFIG = {
  // SPACING & SIZING
  buttonMinHeight: "48px",                                    // Mobile-first touch target height
  buttonPaddingX: "px-7",                                     // Horizontal padding
  buttonPaddingY: "py-3",                                     // Vertical padding
  buttonRadius: "rounded-2xl",                                // Rounded corners
  gapBetweenButtons: "gap-3",                                 // Gap between the two buttons
  buttonTextSize: "text-sm",                                  // Font size
  buttonFontWeightPrimary: "font-semibold",                   // Primary button weight
  buttonFontWeightSecondary: "font-medium",                   // Secondary button weight
};

export interface CtaButtonsProps {
  accentColor?: string;
  accentDark?: string;
  accentSoft?: string;
  onStartPrepping?: () => void;
  onHowItWorks?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function CtaButtons({
  accentColor = "#E7A9B5",
  accentDark = "#A54C5F",
  accentSoft = "#FBECEE",
  onStartPrepping,
  onHowItWorks,
  className = "",
  style,
}: CtaButtonsProps) {
  return (
    <div
      className={`flex flex-row flex-wrap items-center justify-center ${CTA_CONFIG.gapBetweenButtons} mx-auto select-none ${className}`}
      style={style}
    >
      {/* Primary: Start Prepping */}
      <button
        type="button"
        onClick={onStartPrepping}
        className={`group inline-flex items-center justify-center gap-2 ${CTA_CONFIG.buttonPaddingX} ${CTA_CONFIG.buttonPaddingY} ${CTA_CONFIG.buttonRadius} ${CTA_CONFIG.buttonFontWeightPrimary} ${CTA_CONFIG.buttonTextSize} tracking-wide transition-all duration-200 active:scale-[0.98] hover:brightness-105 shadow-md hover:shadow-lg`}
        style={{
          backgroundColor: accentDark,
          color: "#ffffff",
          minHeight: CTA_CONFIG.buttonMinHeight,
          boxShadow: `0 4px 20px ${accentColor}55`,
        }}
      >
        <span>Start Prepping</span>
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>

      {/* Secondary: How it works? */}
      <button
        type="button"
        onClick={onHowItWorks}
        className={`group inline-flex items-center justify-center gap-2 ${CTA_CONFIG.buttonPaddingX} ${CTA_CONFIG.buttonPaddingY} ${CTA_CONFIG.buttonRadius} ${CTA_CONFIG.buttonFontWeightSecondary} ${CTA_CONFIG.buttonTextSize} tracking-wide transition-all duration-200 active:scale-[0.98] hover:opacity-90 border`}
        style={{
          backgroundColor: accentSoft,
          borderColor: accentColor,
          color: accentDark,
          minHeight: CTA_CONFIG.buttonMinHeight,
        }}
      >
        <HelpCircle className="w-4 h-4 opacity-70" />
        <span>How it works?</span>
      </button>
    </div>
  );
}
