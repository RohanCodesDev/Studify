import React from "react";

/**
 * -----------------------------------------------------------------------
 * MURAL ILLUSTRATION LAYOUT CONFIGURATION
 * Tweak these variables to adjust sizing and height easily!
 * -----------------------------------------------------------------------
 */
export const MURAL_CONFIG = {
  // Height of the mountain graphic across mobile, tablet, and desktop
  muralHeight: "max-h-[25vh] sm:max-h-[30vh] md:max-h-[34vh]",

  // Maximum width container constraint on large screens
  muralMaxWidth: "max-w-2xl sm:max-w-3xl",
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
        className={`w-full h-auto ${MURAL_CONFIG.muralHeight} ${MURAL_CONFIG.muralMaxWidth} object-cover object-bottom block mx-auto`}
        loading="eager"
      />
    </div>
  );
}
