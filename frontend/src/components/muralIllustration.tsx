import React from "react";

/**
 * -----------------------------------------------------------------------
 * MURAL ILLUSTRATION LAYOUT CONFIGURATION
 * -----------------------------------------------------------------------
 */
export const MURAL_CONFIG = {
  // Height of the mountain graphic across mobile, tablet, and desktop
  // 36vh-44vh ensures the full mountain peaks are visible without being clipped
  muralHeight: "max-h-[36vh] sm:max-h-[42vh] md:max-h-[46vh]",
};

interface MuralIllustrationProps {
  className?: string;
}

export default function MuralIllustration({ className = "" }: MuralIllustrationProps) {
  return (
    <div
      className={`w-full pointer-events-none select-none relative overflow-hidden flex items-end justify-center ${className}`}
      aria-hidden="true"
    >
      <img
        src="/mural.svg"
        alt="Mountain Mural Illustration"
        className={`w-full min-w-full h-auto ${MURAL_CONFIG.muralHeight} object-cover object-bottom block`}
        loading="eager"
      />
    </div>
  );
}
