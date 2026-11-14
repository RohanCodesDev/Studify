import React, { useId } from "react";

interface MuralIllustrationProps {
  className?: string;
  pageBg?: string;
  accentColor?: string;
  accentDark?: string;
  accentSoft?: string;
  isDarkMode?: boolean;
}

// Convert hex string to normalized RGB [0, 1]
function hexToRgb(hex: string = "#E7A9B5") {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return { r, g, b };
  }
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return {
    r: isNaN(r) ? 0.9 : r,
    g: isNaN(g) ? 0.6 : g,
    b: isNaN(b) ? 0.7 : b,
  };
}

export default function MuralIllustration({
  className = "",
  pageBg = "#FCF5F4",
  accentColor = "#E7A9B5",
  accentDark = "#A54C5F",
  accentSoft = "#FBECEE",
  isDarkMode = false,
}: MuralIllustrationProps) {
  const filterId = useId().replace(/:/g, "-");

  // In light mode, shade the mountain lines with the deep accent for calm contrast.
  // In dark mode, illuminate with the soft pastel accent.
  const targetColor = isDarkMode ? accentColor : accentDark;
  const rgb = hexToRgb(targetColor);

  return (
    <div
      className={`w-full pointer-events-none select-none relative overflow-hidden flex flex-col items-center justify-end ${className}`}
      aria-hidden="true"
    >
      {/* Dynamic SVG Filter that re-shades the grayscale mural to match the active theme */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={`theme-mural-${filterId}`} colorInterpolationFilters="sRGB">
            {/* Color Matrix to tint luminance to theme's RGB */}
            <feColorMatrix
              type="matrix"
              values={`
                ${rgb.r} 0 0 0 0
                ${rgb.g} 0 0 0 0
                ${rgb.b} 0 0 0 0
                0 0 0 1 0
              `}
            />
          </filter>
        </defs>
      </svg>

      {/* Mural Graphic Container */}
      <div className="relative w-full max-w-2xl mx-auto flex items-end justify-center">
        {/* Mountain Mural Image with Dynamic Theme Filter & Transitions */}
        <img
          src="/mural.svg"
          alt="Mountain Mural Illustration"
          className="w-full h-auto max-h-[38vh] sm:max-h-[44vh] md:max-h-[48vh] object-cover object-bottom block transition-all duration-500 ease-in-out"
          style={{
            filter: `url(#theme-mural-${filterId})`,
            mixBlendMode: isDarkMode ? "screen" : "multiply",
            opacity: isDarkMode ? 0.85 : 0.75,
          }}
          loading="eager"
        />

        {/* Delicate Top Gradient Fade: seamlessly merges the mural sky into the active page background */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-500"
          style={{
            background: `linear-gradient(to bottom, ${pageBg} 0%, transparent 60%)`,
          }}
        />

        {/* Delicate Base Glow Tint: imparts a soft theme reflection at the bottom ridge */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none transition-colors duration-500"
          style={{
            background: `linear-gradient(to top, ${accentSoft}33 0%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}
