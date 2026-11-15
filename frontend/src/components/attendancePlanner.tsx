"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AttendancePlannerProps {
  initialHeld?: number;
  initialAttended?: number;
  className?: string;
}

export default function AttendancePlanner({
  initialHeld = 48,
  initialAttended = 41,
  className = "",
}: AttendancePlannerProps) {
  const { colors, isDarkMode } = useTheme();

  const [heldClasses, setHeldClasses] = useState<number>(initialHeld);
  const [attendedClasses, setAttendedClasses] = useState<number>(initialAttended);

  // Compute Attendance
  const attendanceRate =
    heldClasses > 0 ? Math.min(100, Math.round((attendedClasses / heldClasses) * 100)) : 0;

  // Safe bunk or required attendance to hit 75%
  const canBunk = Math.max(0, Math.floor((attendedClasses - 0.75 * heldClasses) / 0.75));
  const needToAttend = Math.max(0, Math.ceil((0.75 * heldClasses - attendedClasses) / 0.25));

  return (
    <section
      className={`p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-4 ${className}`}
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              MAKAUT Exam Rule
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-sans font-bold tracking-tight mt-1">
            75% Attendance Planner
          </h2>
        </div>

        <div
          className="px-3.5 py-1.5 rounded-2xl border text-center shrink-0"
          style={{
            backgroundColor: attendanceRate >= 75 ? "#EAF3E8" : colors.accentSoft,
            borderColor: attendanceRate >= 75 ? "#A9C5A7" : colors.accent,
          }}
        >
          <div
            className="text-[10px] font-sans uppercase tracking-wider font-semibold opacity-70"
            style={{ color: attendanceRate >= 75 ? "#2E5929" : colors.accentDark }}
          >
            Attendance
          </div>
          <div
            className="text-lg sm:text-xl font-sans font-bold"
            style={{ color: attendanceRate >= 75 ? "#2E5929" : colors.accentDark }}
          >
            {attendanceRate}%
          </div>
        </div>
      </div>

      {/* Number Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div
          className="p-3.5 rounded-2xl border flex flex-col gap-1"
          style={{
            backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
            borderColor: colors.border,
          }}
        >
          <label className="text-[11px] font-sans font-medium opacity-65">
            Classes Held
          </label>
          <input
            type="number"
            min={1}
            value={heldClasses}
            onChange={(e) => setHeldClasses(Math.max(1, parseInt(e.target.value) || 1))}
            className="bg-transparent text-base font-bold font-sans outline-none"
          />
        </div>

        <div
          className="p-3.5 rounded-2xl border flex flex-col gap-1"
          style={{
            backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
            borderColor: colors.border,
          }}
        >
          <label className="text-[11px] font-sans font-medium opacity-65">
            Classes Attended
          </label>
          <input
            type="number"
            min={0}
            max={heldClasses}
            value={attendedClasses}
            onChange={(e) =>
              setAttendedClasses(
                Math.max(0, Math.min(heldClasses, parseInt(e.target.value) || 0))
              )
            }
            className="bg-transparent text-base font-bold font-sans outline-none"
          />
        </div>
      </div>

      {/* Gentle Advice Banner */}
      <div
        className="p-3.5 rounded-2xl border flex items-start gap-3 transition-colors text-xs font-body leading-relaxed"
        style={{
          backgroundColor: attendanceRate >= 75 ? "#EAF3E8" : colors.accentSoft,
          borderColor: attendanceRate >= 75 ? "#CFE0CE" : colors.accent,
          color: attendanceRate >= 75 ? "#2E5929" : colors.accentDark,
        }}
      >
        {attendanceRate >= 75 ? (
          <>
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>You are above 75%.</strong> You can safely miss{" "}
              <strong>{canBunk}</strong> more classes while retaining your MAKAUT admit card eligibility.
            </div>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <strong>Currently below 75%.</strong> You need to attend the next{" "}
              <strong>{needToAttend}</strong> consecutive classes to cross the 75% eligibility mark.
            </div>
          </>
        )}
      </div>
    </section>
  );
}
