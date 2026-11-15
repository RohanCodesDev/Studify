"use client";

import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

// MAKAUT 10-Point Grade Scale
export const GRADE_POINTS: Record<string, number> = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  F: 0,
};

export interface CourseRow {
  id: string;
  name: string;
  credit: number;
  grade: string;
}

interface GpaCalculatorProps {
  initialCourses?: CourseRow[];
  className?: string;
}

const DEFAULT_COURSES: CourseRow[] = [
  { id: "1", name: "DBMS", credit: 4, grade: "E" },
  { id: "2", name: "OS", credit: 4, grade: "A" },
  { id: "3", name: "Design & Analysis of Algo", credit: 4, grade: "O" },
  { id: "4", name: "DBMS Lab", credit: 1.5, grade: "O" },
  { id: "5", name: "OS Lab", credit: 1.5, grade: "E" },
];

export default function GpaCalculator({
  initialCourses = DEFAULT_COURSES,
  className = "",
}: GpaCalculatorProps) {
  const { colors, isDarkMode } = useTheme();
  const [courses, setCourses] = useState<CourseRow[]>(initialCourses);

  // Compute SGPA = sum(credit * point) / sum(credit)
  const totalCredits = courses.reduce((sum, c) => sum + (c.credit || 0), 0);
  const totalPoints = courses.reduce(
    (sum, c) => sum + (c.credit || 0) * (GRADE_POINTS[c.grade] ?? 0),
    0
  );
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: `Subject ${prev.length + 1}`,
        credit: 3,
        grade: "A",
      },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
    }
  };

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
              MAKAUT 10-Point Scale
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-sans font-bold tracking-tight mt-1">
            SGPA / CGPA Calculator
          </h2>
        </div>

        {/* Live SGPA Badge */}
        <div
          className="px-3.5 py-1.5 rounded-2xl border text-center shrink-0"
          style={{
            backgroundColor: colors.accentSoft,
            borderColor: colors.accent,
          }}
        >
          <div
            className="text-[10px] font-sans uppercase tracking-wider font-semibold opacity-70"
            style={{ color: colors.accentDark }}
          >
            Est. SGPA
          </div>
          <div
            className="text-lg sm:text-xl font-sans font-bold"
            style={{ color: colors.accentDark }}
          >
            {sgpa}
          </div>
        </div>
      </div>

      {/* Course rows */}
      <div className="space-y-2 overflow-hidden">
        <AnimatePresence initial={false}>
          {courses.map((course) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, height: 0, scale: 0.98 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-2xl border text-xs"
              style={{
                backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
                borderColor: colors.border,
              }}
            >
              <input
                type="text"
                value={course.name}
                onChange={(e) => {
                  const val = e.target.value;
                  setCourses((prev) =>
                    prev.map((c) => (c.id === course.id ? { ...c, name: val } : c))
                  );
                }}
                placeholder="Subject"
                className="col-span-6 bg-transparent font-medium font-sans px-2 py-1 outline-none"
              />

              <select
                value={course.credit}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setCourses((prev) =>
                    prev.map((c) => (c.id === course.id ? { ...c, credit: val } : c))
                  );
                }}
                aria-label="Course Credit"
                className="col-span-3 bg-transparent font-sans px-2 py-1 outline-none rounded-lg"
              >
                <option value={4}>4 cr</option>
                <option value={3}>3 cr</option>
                <option value={2}>2 cr</option>
                <option value={1.5}>1.5 cr</option>
                <option value={1}>1 cr</option>
              </select>

              <select
                value={course.grade}
                onChange={(e) => {
                  const val = e.target.value;
                  setCourses((prev) =>
                    prev.map((c) => (c.id === course.id ? { ...c, grade: val } : c))
                  );
                }}
                aria-label="Letter Grade"
                className="col-span-2 bg-transparent font-sans font-bold px-1 py-1 outline-none rounded-lg"
              >
                {Object.keys(GRADE_POINTS).map((g) => (
                  <option key={g} value={g}>
                    {g} ({GRADE_POINTS[g]})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                aria-label="Remove subject"
                className="col-span-1 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={addCourse}
        className="w-full min-h-[40px] py-2 rounded-2xl text-xs font-sans font-semibold flex items-center justify-center gap-1.5 border transition-all active:scale-[0.98]"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          color: colors.ink,
        }}
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Subject Row</span>
      </button>
    </section>
  );
}
