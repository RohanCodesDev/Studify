"use client";

import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Clock,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Award,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { MOCK_QUIZ_DATA, QuizQuestion, QuizMetadata } from "@/data/mockQuizQuestions";
import { calculateSM2, SM2Output } from "@/lib/spacedRepetition";

export default function QuizRunnerPage() {
  const router = useRouter();
  const { id } = router.query;
  const { colors, isDarkMode } = useTheme();

  const quizId = typeof id === "string" ? id : "quiz_dbms_m3";
  const defaultQuiz: QuizMetadata = MOCK_QUIZ_DATA[quizId] || MOCK_QUIZ_DATA["quiz_dbms_m3"];

  const [questions, setQuestions] = useState<QuizQuestion[]>(defaultQuiz.questions);

  // Quiz progression & interactive states
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [missedSubtopics, setMissedSubtopics] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [sm2Result, setSm2Result] = useState<SM2Output | null>(null);

  // Dynamic question fetch from Neon DB with fallback
  useEffect(() => {
    if (!id || typeof id !== "string") return;
    let isMounted = true;
    fetch(`/api/quiz/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (
          isMounted &&
          data &&
          data.success &&
          Array.isArray(data.questions) &&
          data.questions.length > 0
        ) {
          const mapped: QuizQuestion[] = data.questions.map((q: any, i: number) => ({
            id: q.id || `q_${i}`,
            questionNumber: i + 1,
            questionText: q.questionText,
            options: Array.isArray(q.options)
              ? q.options
              : typeof q.options === "string"
              ? JSON.parse(q.options)
              : defaultQuiz.questions[i]?.options || [],
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || defaultQuiz.questions[i]?.explanation || "",
            memoryAnchor:
              defaultQuiz.questions[i]?.memoryAnchor || "Core rule for MAKAUT semester exams.",
            pyqDetails:
              q.pyqYears && q.pyqYears.length > 0
                ? `MAKAUT ${q.pyqYears.join(", ")} Group A`
                : defaultQuiz.questions[i]?.pyqDetails || "MAKAUT Group A",
            subtopic: defaultQuiz.questions[i]?.subtopic || "Relational Normalization",
          }));
          setQuestions(mapped);
        }
      })
      .catch((err) => {
        console.warn("Dynamic quiz questions fetch fallback:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Timer loop
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  const currentQuestion: QuizQuestion = questions[currentIndex] || questions[0];

  // State 1: User selects an option (does NOT auto-submit, allows deliberate choice)
  const handleSelectOption = (option: string) => {
    if (hasAnswered) return;
    setSelectedOption(option);
  };

  // State 2: User clicks "Check Answer" to lock in their choice
  const handleCheckAnswer = () => {
    if (!selectedOption || hasAnswered) return;
    setHasAnswered(true);

    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setMissedSubtopics((prev) => [...prev, currentQuestion.subtopic]);
    }
  };

  // State 3: User clicks "Next Question" to advance
  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Quiz finished: calculate SM-2 spaced repetition
      const finalMissed =
        selectedOption !== currentQuestion.correctAnswer
          ? [...missedSubtopics, currentQuestion.subtopic]
          : missedSubtopics;

      const result = calculateSM2({
        correctCount,
        totalQuestions: questions.length,
        missedSubtopics: finalMissed,
      });

      setSm2Result(result);
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectCount(0);
    setMissedSubtopics([]);
    setIsCompleted(false);
    setElapsedSeconds(0);
    setSm2Result(null);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/practice");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = Math.round(
    ((currentIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100
  );

  return (
    <>
      <Head>
        <title>{`${defaultQuiz.title} · Studify Adaptive Quiz`}</title>
        <meta
          name="description"
          content={`10 MAKAUT Group A objective questions for ${defaultQuiz.subjectCode}: ${defaultQuiz.title}`}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className="w-full min-h-screen min-h-[100dvh] relative flex flex-col font-sans transition-colors duration-300 overflow-x-hidden"
        style={{
          backgroundColor: colors.pageBg,
          color: colors.ink,
        }}
      >
        {/* ══════════════════════════════════════════════════════
            1. TOP NAVIGATION HEADER & 3PX MICRO-PROGRESS BAR
        ══════════════════════════════════════════════════════ */}
        <header
          className="sticky top-0 z-30 w-full backdrop-blur-xl border-b transition-colors duration-300"
          style={{
            backgroundColor: isDarkMode ? `${colors.cardBg}E6` : `${colors.cardBg}CC`,
            borderColor: colors.border,
          }}
        >
          {/* Micro-Progress Bar (3px high pinned at top) */}
          <div className="w-full h-[3px] bg-black/5 dark:bg-white/5 relative overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: colors.accentDark }}
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>

          <div className="max-w-xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Exit Quiz"
              className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 rounded-2xl border transition-all active:scale-95 shadow-xs"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.ink,
              }}
            >
              <ArrowLeft className="w-5 h-5" style={{ color: colors.accentDark }} />
            </button>

            {/* Question Counter & Timer */}
            <div className="flex flex-col items-center">
              <span className="text-xs font-sans font-bold tracking-tight">
                {isCompleted
                  ? "Quiz Complete"
                  : `Question ${currentIndex + 1} of ${questions.length}`}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] font-body opacity-70">
                <Clock className="w-3 h-3" />
                <span>{formatTime(elapsedSeconds)}</span>
                <span>·</span>
                <span>{defaultQuiz.subjectCode}</span>
              </div>
            </div>

            {/* Live Score Pill */}
            <div
              className="px-2.5 py-1 rounded-xl border text-xs font-sans font-semibold shadow-xs"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.accentDark,
              }}
            >
              <span>{correctCount} Correct</span>
            </div>
          </div>
        </header>

        {/* ══════════════════════════════════════════════════════
            2. MAIN CONTENT AREA (Padded for sticky bottom bar)
        ══════════════════════════════════════════════════════ */}
        <main
          className={`w-full max-w-xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 ${
            !isCompleted ? "pb-28 sm:pb-32" : "pb-12"
          }`}
        >
          {!isCompleted ? (
            /* ── ACTIVE QUESTION VIEW ── */
            <div className="flex flex-col gap-3.5">
              {/* ── CONSOLIDATED SINGLE-LINE METADATA ROW ── */}
              <div className="flex items-center justify-between text-[11px] font-sans font-semibold">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="px-2.5 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: colors.accentSoft,
                      color: colors.accentDark,
                    }}
                  >
                    1 Mark
                  </span>
                  <span
                    className="truncate opacity-75 font-body"
                    style={{ color: colors.inkMuted }}
                  >
                    {currentQuestion.subtopic}
                  </span>
                </div>

                <span
                  className="px-2.5 py-0.5 rounded-full shrink-0 ml-2"
                  style={{
                    backgroundColor: "#FEF7E6",
                    color: "#8A5A00",
                  }}
                >
                  {currentQuestion.pyqDetails}
                </span>
              </div>

              {/* ── QUESTION CARD ── */}
              <div
                className="p-4 sm:p-5 rounded-3xl border shadow-sm transition-all"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <h2
                  className="text-sm sm:text-base font-sans font-semibold leading-relaxed"
                  style={{ color: colors.ink }}
                >
                  {currentQuestion.questionText}
                </h2>
              </div>

              {/* ── 4 OPTION BUTTONS WITH SELECTED & FEEDBACK STATES ── */}
              <div className="flex flex-col gap-2.5">
                {currentQuestion.options.map((option, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C, D
                  const isSelected = selectedOption === option;
                  const isCorrectAnswer = option === currentQuestion.correctAnswer;

                  // Styling logic across the 3 interactive states
                  let buttonBg = colors.cardBg;
                  let buttonBorder = colors.border;
                  let textColor = colors.ink;
                  let letterBg = colors.accentSoft;
                  let letterColor = colors.accentDark;
                  let indicatorElement = (
                    <div
                      className="w-4 h-4 rounded-full border shrink-0 opacity-40 transition-colors"
                      style={{ borderColor: colors.inkMuted }}
                    />
                  );

                  if (!hasAnswered) {
                    // State 1: Active selection state (tapped before submission)
                    if (isSelected) {
                      buttonBg = isDarkMode ? `${colors.accentDark}20` : `${colors.accentSoft}70`;
                      buttonBorder = colors.accentDark;
                      textColor = colors.ink;
                      letterBg = colors.accentDark;
                      letterColor = "#FFFFFF";
                      indicatorElement = (
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                          style={{ borderColor: colors.accentDark }}
                        >
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colors.accentDark }}
                          />
                        </div>
                      );
                    }
                  } else {
                    // State 2: Answer checked feedback state
                    if (isCorrectAnswer) {
                      // Gentle green for the correct option
                      buttonBg = "#EAF3E8";
                      buttonBorder = "#C3E2BD";
                      textColor = "#2E5929";
                      letterBg = "#C3E2BD";
                      letterColor = "#2E5929";
                      indicatorElement = (
                        <CheckCircle2 className="w-5 h-5 text-[#2E5929] shrink-0" />
                      );
                    } else if (isSelected && !isCorrectAnswer) {
                      // Muted rose for the chosen wrong option (strict: never screaming red)
                      buttonBg = "#FDF0F0";
                      buttonBorder = "#F5C6CB";
                      textColor = "#7D3B4A";
                      letterBg = "#F5C6CB";
                      letterColor = "#7D3B4A";
                      indicatorElement = <XCircle className="w-5 h-5 text-[#7D3B4A] shrink-0" />;
                    } else {
                      // Unselected wrong options: gently subdued
                      textColor = colors.inkMuted;
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      type="button"
                      disabled={hasAnswered}
                      onClick={() => handleSelectOption(option)}
                      whileTap={{ scale: hasAnswered ? 1 : 0.98 }}
                      className={`
                        w-full min-h-[52px] p-3 sm:p-3.5 rounded-2xl border text-left
                        flex items-center gap-3 transition-all duration-150 shadow-xs
                        ${!hasAnswered ? "cursor-pointer active:scale-[0.98]" : "cursor-default"}
                        ${hasAnswered && !isSelected && !isCorrectAnswer ? "opacity-50" : "opacity-100"}
                      `}
                      style={{
                        backgroundColor: buttonBg,
                        borderColor: buttonBorder,
                        borderWidth: isSelected && !hasAnswered ? "2px" : "1px",
                        color: textColor,
                      }}
                    >
                      {/* Letter Badge (A, B, C, D) */}
                      <span
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-sans font-bold shrink-0 transition-colors"
                        style={{
                          backgroundColor: letterBg,
                          color: letterColor,
                        }}
                      >
                        {letter}
                      </span>

                      {/* Option Text */}
                      <span className="flex-1 text-xs sm:text-sm font-body leading-relaxed">
                        {option}
                      </span>

                      {/* Radio / Status Icon */}
                      {indicatorElement}
                    </motion.button>
                  );
                })}
              </div>

              {/* ── CONCEPT RATIONALE CALLOUT (Slides in once answered) ── */}
              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 8, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col gap-2.5 my-1"
                      style={{
                        backgroundColor: isDarkMode ? "#1B1719" : "#FCFAF8",
                        borderColor: colors.border,
                      }}
                    >
                      {/* Rationale Header */}
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" style={{ color: colors.accentDark }} />
                        <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                          Concept Rationale
                        </h3>
                      </div>

                      {/* Explanation prose */}
                      <p
                        className="text-xs sm:text-sm font-body leading-relaxed"
                        style={{ color: colors.ink }}
                      >
                        {currentQuestion.explanation}
                      </p>

                      {/* Core Memory Anchor Pill Box */}
                      <div
                        className="p-3 rounded-xl border text-xs font-body leading-relaxed flex items-start gap-2"
                        style={{
                          backgroundColor: colors.accentSoft,
                          borderColor: colors.accent,
                          color: colors.ink,
                        }}
                      >
                        <span
                          className="font-sans font-bold shrink-0 text-[11px]"
                          style={{ color: colors.accentDark }}
                        >
                          Anchor:
                        </span>
                        <span className="text-[11px]">{currentQuestion.memoryAnchor}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* ── RESULTS & SPACED REPETITION (SM-2) VIEW ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-5 pt-2"
            >
              {/* Score Header Card */}
              <div
                className="p-6 sm:p-7 rounded-3xl border shadow-sm text-center flex flex-col items-center gap-3"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xs"
                  style={{
                    backgroundColor: colors.accentSoft,
                    borderColor: colors.accent,
                    color: colors.accentDark,
                  }}
                >
                  <Award className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <span
                    className="text-xs uppercase tracking-wider font-semibold font-sans opacity-70"
                    style={{ color: colors.accentDark }}
                  >
                    Drill Completed
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
                    {correctCount} / {questions.length} Correct
                  </h1>
                  <p
                    className="text-xs sm:text-sm font-body opacity-75"
                    style={{ color: colors.inkMuted }}
                  >
                    Accuracy: {sm2Result?.accuracyPercent}% · Completed in {formatTime(elapsedSeconds)}
                  </p>
                </div>

                <span
                  className="px-3.5 py-1 rounded-full text-xs font-sans font-semibold border"
                  style={{
                    backgroundColor:
                      sm2Result?.masteryLevel === "Mastered"
                        ? "#EAF3E8"
                        : sm2Result?.masteryLevel === "Proficient"
                        ? colors.accentSoft
                        : "#FDF0F0",
                    borderColor:
                      sm2Result?.masteryLevel === "Mastered"
                        ? "#C3E2BD"
                        : colors.accent,
                    color:
                      sm2Result?.masteryLevel === "Mastered"
                        ? "#2E5929"
                        : sm2Result?.masteryLevel === "Proficient"
                        ? colors.accentDark
                        : "#7D3B4A",
                  }}
                >
                  {sm2Result?.masteryLevel}
                </span>
              </div>

              {/* Spaced Repetition (SM-2) Schedule Card */}
              {sm2Result && (
                <div
                  className="p-5 rounded-3xl border shadow-sm flex flex-col gap-3"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: colors.accentDark }} />
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                      Spaced Repetition Schedule (SM-2)
                    </h3>
                  </div>

                  <p
                    className="text-xs sm:text-sm font-body leading-relaxed"
                    style={{ color: colors.ink }}
                  >
                    Based on your recall performance, your optimal review schedule is set to:
                  </p>

                  <div
                    className="p-4 rounded-2xl border flex items-center justify-between"
                    style={{
                      backgroundColor: colors.accentSoft,
                      borderColor: colors.accent,
                    }}
                  >
                    <div>
                      <div
                        className="text-xs font-body opacity-70"
                        style={{ color: colors.inkMuted }}
                      >
                        Next Recommended Review
                      </div>
                      <div
                        className="text-sm font-sans font-bold mt-0.5"
                        style={{ color: colors.accentDark }}
                      >
                        {sm2Result.nextReviewLabel}
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="text-xs font-body opacity-70"
                        style={{ color: colors.inkMuted }}
                      >
                        Ease Factor
                      </div>
                      <div
                        className="text-sm font-sans font-bold mt-0.5"
                        style={{ color: colors.accentDark }}
                      >
                        {sm2Result.easeFactor}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Weak Subtopics Card (if any were missed) */}
              {sm2Result && sm2Result.weakSubtopics.length > 0 && (
                <div
                  className="p-5 rounded-3xl border shadow-sm flex flex-col gap-3"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#7D3B4A]" />
                    <h3 className="text-xs font-sans font-bold uppercase tracking-wider">
                      Subtopics to Review Before Finals
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sm2Result.weakSubtopics.map((topic, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-sans font-medium border"
                        style={{
                          backgroundColor: "#FDF0F0",
                          borderColor: "#F5C6CB",
                          color: "#7D3B4A",
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons */}
              <div className="flex flex-col gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => router.push("/study/sess_dbms")}
                  className="w-full min-h-[46px] rounded-2xl font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.accentDark,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 14px ${colors.accent}55`,
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Notes in Reading View</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestartQuiz}
                  className="w-full min-h-[46px] rounded-2xl font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-[0.98]"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.border,
                    color: colors.ink,
                  }}
                >
                  <RotateCcw className="w-4 h-4" style={{ color: colors.accentDark }} />
                  <span>Try Again</span>
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/practice")}
                  className="w-full min-h-[46px] rounded-2xl font-sans font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] opacity-75"
                  style={{ color: colors.inkMuted }}
                >
                  <span>Return to Practice Arena</span>
                </button>
              </div>
            </motion.div>
          )}
        </main>

        {/* ══════════════════════════════════════════════════════
            3. STICKY FULL-WIDTH ACTION BUTTON (Pinned to Bottom)
        ══════════════════════════════════════════════════════ */}
        {!isCompleted && (
          <div
            className="fixed bottom-0 inset-x-0 w-full p-4 border-t backdrop-blur-xl z-40 transition-colors duration-300 flex justify-center pb-[calc(1rem+env(safe-area-inset-bottom))]"
            style={{
              backgroundColor: isDarkMode ? `${colors.cardBg}F5` : `${colors.cardBg}EE`,
              borderColor: colors.border,
            }}
          >
            <div className="w-full max-w-xl">
              {!hasAnswered ? (
                /* State 1 (Disabled until selected) or State 2 ("Check Answer") */
                <button
                  type="button"
                  disabled={!selectedOption}
                  onClick={handleCheckAnswer}
                  className={`
                    w-full min-h-[48px] py-3 rounded-2xl text-xs sm:text-sm font-sans font-semibold tracking-wide
                    flex items-center justify-center gap-2 transition-all duration-200 shadow-sm
                    ${
                      selectedOption
                        ? "active:scale-[0.98] cursor-pointer shadow-md"
                        : "cursor-not-allowed opacity-50"
                    }
                  `}
                  style={{
                    backgroundColor: selectedOption ? colors.accentDark : colors.border,
                    color: selectedOption ? "#FFFFFF" : colors.inkMuted,
                    boxShadow: selectedOption ? `0 4px 16px ${colors.accent}66` : "none",
                  }}
                >
                  <span>{selectedOption ? "Check Answer" : "Select an Option"}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              ) : (
                /* State 3: "Next Question" / "View Summary" */
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="w-full min-h-[48px] py-3 rounded-2xl text-xs sm:text-sm font-sans font-semibold tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md cursor-pointer"
                  style={{
                    backgroundColor: colors.accentDark,
                    color: "#FFFFFF",
                    boxShadow: `0 4px 16px ${colors.accent}66`,
                  }}
                >
                  <span>
                    {currentIndex + 1 < questions.length
                      ? "Next Question"
                      : "View Quiz Summary"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
