import Head from "next/head";
import { useState } from "react";
import { Calculator, CheckCircle2, AlertCircle, Plus, Trash2, Calendar } from "lucide-react";
import BottomNav from "@/components/bottomNav";
import { useTheme } from "@/context/ThemeContext";

// MAKAUT 10-Point Grade Scale
const GRADE_POINTS: Record<string, number> = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  F: 0,
};

interface CourseRow {
  id: string;
  name: string;
  credit: number;
  grade: string;
}

export default function ToolsPage() {
  const { colors, isDarkMode } = useTheme();

  // ── SGPA Calculator State ──
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: "1", name: "DBMS", credit: 4, grade: "E" },
    { id: "2", name: "OS", credit: 4, grade: "A" },
    { id: "3", name: "Design & Analysis of Algo", credit: 4, grade: "O" },
    { id: "4", name: "DBMS Lab", credit: 1.5, grade: "O" },
    { id: "5", name: "OS Lab", credit: 1.5, grade: "E" },
  ]);

  // ── Attendance Planner State ──
  const [heldClasses, setHeldClasses] = useState<number>(48);
  const [attendedClasses, setAttendedClasses] = useState<number>(41);

  // Compute SGPA = sum(credit * point) / sum(credit)
  const totalCredits = courses.reduce((sum, c) => sum + (c.credit || 0), 0);
  const totalPoints = courses.reduce(
    (sum, c) => sum + (c.credit || 0) * (GRADE_POINTS[c.grade] ?? 0),
    0
  );
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";

  // Compute Attendance
  const attendanceRate =
    heldClasses > 0 ? Math.min(100, Math.round((attendedClasses / heldClasses) * 100)) : 0;
  
  // Safe bunk or required attendance to hit 75%
  // 75% condition: attended / (held + X) >= 0.75  => X <= (attended - 0.75*held) / 0.75
  // If < 75%: (attended + Y) / (held + Y) >= 0.75 => Y >= (0.75*held - attended) / 0.25
  const canBunk = Math.max(0, Math.floor((attendedClasses - 0.75 * heldClasses) / 0.75));
  const needToAttend = Math.max(0, Math.ceil((0.75 * heldClasses - attendedClasses) / 0.25));

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
    <>
      <Head>
        <title>Academic Tools · Studify</title>
        <meta
          name="description"
          content="Free MAKAUT SGPA/CGPA Calculator and 75% Attendance Planner. Usable without signup."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col overflow-x-hidden transition-colors duration-300 font-sans"
        style={{ backgroundColor: colors.pageBg, color: colors.ink }}
      >
        <div className="w-full max-w-4xl mx-auto flex flex-col">
          {/* ── Page Header ── */}
          <header className="px-4 sm:px-6 py-5 sm:py-6">
            <span
              className="text-xs font-body tracking-wide"
              style={{ color: colors.inkMuted }}
            >
              Free University Utilities
            </span>
            <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
              Academic Tools
            </h1>
          </header>

          {/* ── Main Content Container ── */}
          <main className="w-full px-4 sm:px-6 flex flex-col gap-6 pb-36">
            {/* Tool 1: SGPA Calculator */}
            <section
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-4"
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
              <div className="space-y-2">
                {courses.map((course) => (
                  <div
                    key={course.id}
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
                  </div>
                ))}
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

            {/* Tool 2: 75% Attendance Planner */}
            <section
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-4"
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

              {/* Gentle Advice Banner (No screaming red) */}
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
          </main>
        </div>

        {/* ── Fixed Bottom Navigation Dock ── */}
        <BottomNav activeTab="tools" />
      </div>
    </>
  );
}
