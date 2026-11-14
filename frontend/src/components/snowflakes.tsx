import React, { useEffect, useState } from "react";

/**
 * -----------------------------------------------------------------------
 * SNOWFLAKES CONFIGURATION
 * Easily tweak particle count, speeds, and sizes!
 * -----------------------------------------------------------------------
 */
export const SNOW_CONFIG = {
  flakeCount: 36,               // Total flakes (balanced for 60fps performance on mobile)
  minSizePx: 3,                 // Smallest flake size in px
  maxSizePx: 8,                 // Largest flake size in px
  minDurationSec: 7,            // Fastest fall duration in seconds
  maxDurationSec: 15,           // Slowest fall duration in seconds
  maxDelaySec: 8,               // Maximum initial delay spread in seconds
  skyBlueColor: "#bee9fbff",      // Sky blue color (vibrant sky blue) ← tweak this
  skyBlueDarkColor: "#7DD3FC",  // Sky blue color for dark mode (soft glowing sky blue) ← tweak this
};

interface Flake {
  id: number;
  left: number;                 // 0% - 100%
  size: number;                 // in px
  duration: number;             // animation duration in sec
  delay: number;                // animation delay in sec
  opacity: number;              // 0.3 - 0.85
  swayAmount: number;           // horizontal sway distance in px
  swayDuration: number;         // sway cycle duration in sec
  isCrystal: boolean;           // true for ❄ crystal, false for soft blurred snow dot
}

interface SnowflakesProps {
  color?: string;
  count?: number;
  className?: string;
}

export default function Snowflakes({
  color = SNOW_CONFIG.skyBlueColor,
  count = SNOW_CONFIG.flakeCount,
  className = "",
}: SnowflakesProps) {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  // Generate flakes on client only to avoid SSR hydration mismatches
  useEffect(() => {
    const generated: Flake[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.round(
        SNOW_CONFIG.minSizePx + Math.random() * (SNOW_CONFIG.maxSizePx - SNOW_CONFIG.minSizePx)
      );
      const duration = Number(
        (SNOW_CONFIG.minDurationSec + Math.random() * (SNOW_CONFIG.maxDurationSec - SNOW_CONFIG.minDurationSec)).toFixed(2)
      );
      const delay = Number((Math.random() * SNOW_CONFIG.maxDelaySec).toFixed(2));
      const opacity = Number((0.35 + Math.random() * 0.5).toFixed(2));
      const swayAmount = Math.round(15 + Math.random() * 25);
      const swayDuration = Number((2.5 + Math.random() * 3).toFixed(2));
      const isCrystal = i % 3 === 0; // ~33% delicate SVG snowflake crystals, 67% soft snow dots

      generated.push({
        id: i,
        left: Number((Math.random() * 100).toFixed(2)),
        size,
        duration,
        delay,
        opacity,
        swayAmount,
        swayDuration,
        isCrystal,
      });
    }
    setFlakes(generated);
  }, [count]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none overflow-hidden z-20 select-none ${className}`}
    >
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(105vh);
          }
        }
        @keyframes sway {
          0%, 100% {
            margin-left: 0px;
          }
          50% {
            margin-left: var(--sway, 20px);
          }
        }
        .snow-particle {
          position: absolute;
          top: -20px;
          will-change: transform;
          animation-name: snowfall, sway;
          animation-timing-function: linear, ease-in-out;
          animation-iteration-count: infinite, infinite;
        }
      `}</style>

      {flakes.map((flake) => (
        <span
          key={flake.id}
          className="snow-particle inline-block"
          style={
            {
              left: `${flake.left}%`,
              animationDuration: `${flake.duration}s, ${flake.swayDuration}s`,
              animationDelay: `-${flake.delay}s, -${flake.delay * 0.5}s`,
              opacity: flake.opacity,
              "--sway": `${flake.swayAmount}px`,
              filter: "drop-shadow(0 1px 2px rgba(59, 53, 64, 0.15))",
            } as React.CSSProperties
          }
        >
          {flake.isCrystal ? (
            /* Delicate 6-branch snowflake crystal */
            <svg
              width={flake.size + 4}
              height={flake.size + 4}
              viewBox="0 0 24 24"
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transform rotate-12"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="3.34" y1="7" x2="20.66" y2="17" />
              <line x1="3.34" y1="17" x2="20.66" y2="7" />
              <line x1="10" y1="5" x2="12" y2="3" />
              <line x1="14" y1="5" x2="12" y2="3" />
              <line x1="10" y1="19" x2="12" y2="21" />
              <line x1="14" y1="19" x2="12" y2="21" />
            </svg>
          ) : (
            /* Soft circular snow dot */
            <span
              className="block rounded-full"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}`,
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
