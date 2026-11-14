import React from "react";

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
        className="w-full h-auto max-h-[42vh] sm:max-h-[48vh] object-cover object-bottom block mx-auto"
        loading="eager"
      />
    </div>
  );
}
