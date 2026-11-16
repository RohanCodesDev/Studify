"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Languages,
  ChevronDown,
  Layers,
  FileCode2,
  ExternalLink,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { NoteContent } from "@/data/mockStudyNotes";
import { MarksFormat } from "./marksTabBar";

interface ReadingNoteRendererProps {
  notes: NoteContent;
  activeFormat: MarksFormat;
  className?: string;
}

export default function ReadingNoteRenderer({
  notes,
  activeFormat,
  className = "",
}: ReadingNoteRendererProps) {
  const { colors, isDarkMode } = useTheme();
  const [showBilingual, setShowBilingual] = useState<boolean>(false);
  const [bilingualLang, setBilingualLang] = useState<"hinglish" | "bengali">("hinglish");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Clean up speech synthesis on unmount or drawer collapse
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleAudio = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert("Audio speech synthesis is not supported on this browser.");
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();

    const textToSpeak =
      bilingualLang === "hinglish"
        ? notes.bilingualExplanation.hinglish
        : notes.bilingualExplanation.bengali;

    if (!textToSpeak || !textToSpeak.trim()) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (bilingualLang === "bengali") {
      utterance.lang = "bn-IN";
    } else {
      utterance.lang = "hi-IN";
    }

    utterance.rate = 0.92; // Calm, comprehensible pace for revision
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleSelectLang = (lang: "hinglish" | "bengali") => {
    if (isPlayingAudio && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
    setBilingualLang(lang);
  };

  return (
    <div className={`w-full flex flex-col gap-5 ${className}`}>
      <AnimatePresence mode="wait">
        {/* ══════════════════════════════════════════════════════
            1-MARK OBJECTIVE VIEW
        ══════════════════════════════════════════════════════ */}
        {activeFormat === "oneMark" && (
          <motion.div
            key="oneMark"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 font-body"
          >
            {/* Core Definition Card */}
            <div
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <div className="mb-3">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                  style={{
                    backgroundColor: colors.accentSoft,
                    color: colors.accentDark,
                  }}
                >
                  1 Mark Objective
                </span>
              </div>

              <p
                className="text-base sm:text-lg leading-[1.75] font-normal"
                style={{ color: colors.ink }}
              >
                {notes.oneMark.definition}
              </p>
            </div>

            {/* Merged Single Highlight Box: Core Memory Anchor */}
            <div
              className="p-4 sm:p-5 rounded-2xl border flex items-start gap-3"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              }}
            >
              <Lightbulb
                className="w-5 h-5 shrink-0 mt-0.5"
                style={{ color: colors.accentDark }}
              />
              <div className="space-y-1">
                <div
                  className="text-xs uppercase tracking-wider font-semibold font-sans"
                  style={{ color: colors.accentDark }}
                >
                  Core Memory Anchor
                </div>
                <div className="text-sm font-body leading-relaxed" style={{ color: colors.ink }}>
                  {notes.oneMark.keyRule}
                </div>
                {notes.oneMark.quickFact && (
                  <p className="text-xs font-body opacity-80 pt-0.5 leading-relaxed" style={{ color: colors.inkMuted }}>
                    {notes.oneMark.quickFact}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            5-MARKS SHORT ANSWER VIEW
        ══════════════════════════════════════════════════════ */}
        {activeFormat === "fiveMarks" && (
          <motion.div
            key="fiveMarks"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 font-body"
          >
            {/* Lead Definition */}
            <div
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <span
                className="w-fit px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                style={{
                  backgroundColor: colors.accentSoft,
                  color: colors.accentDark,
                }}
              >
                5 Marks Short Note
              </span>

              <h3 className="text-sm sm:text-base font-sans font-bold tracking-tight">
                1. Standard Academic Definition
              </h3>
              <p className="text-sm sm:text-base leading-[1.75]" style={{ color: colors.ink }}>
                {notes.fiveMarks.leadDefinition}
              </p>
            </div>

            {/* Core Principles */}
            <div
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <h3 className="text-sm sm:text-base font-sans font-bold tracking-tight">
                2. Key Examination Principles
              </h3>
              <ul className="space-y-2.5">
                {notes.fiveMarks.corePrinciples.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0 mt-2"
                      style={{ backgroundColor: colors.accentDark }}
                    />
                    <span style={{ color: colors.ink }}>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture / Diagram Box */}
            <div
              className="p-4 sm:p-5 rounded-3xl border flex flex-col gap-2 font-mono text-xs overflow-x-auto"
              style={{
                backgroundColor: isDarkMode ? "#141113" : "#F8F6F7",
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-sans font-semibold opacity-70">
                <span className="flex items-center gap-1.5">
                  <FileCode2 className="w-3.5 h-3.5" style={{ color: colors.accentDark }} />
                  <span>{notes.fiveMarks.diagramLabel}</span>
                </span>
                <span className="text-[10px] opacity-60">Visual Blueprint</span>
              </div>
              <pre className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 whitespace-pre leading-relaxed font-mono text-[11px] sm:text-xs overflow-x-auto">
                {notes.fiveMarks.diagramContent}
              </pre>
            </div>

            {/* Academic Example */}
            <div
              className="p-4 sm:p-5 rounded-2xl border flex flex-col gap-1.5"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              }}
            >
              <div className="text-xs uppercase tracking-wider font-semibold font-sans" style={{ color: colors.accentDark }}>
                3. Concrete University Example: {notes.fiveMarks.academicExample.title}
              </div>
              <p className="text-xs sm:text-sm font-body leading-relaxed" style={{ color: colors.ink }}>
                {notes.fiveMarks.academicExample.description}
              </p>
            </div>

            {/* Source Citation */}
            <div className="text-right text-[11px] font-body opacity-60 italic" style={{ color: colors.inkMuted }}>
              Grounding: {notes.fiveMarks.sourceCitation}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            15-MARKS LONG FORM ANSWER VIEW
        ══════════════════════════════════════════════════════ */}
        {activeFormat === "fifteenMarks" && (
          <motion.div
            key="fifteenMarks"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 font-body"
          >
            {/* Header Badge */}
            <div>
              <span
                className="px-2.5 py-0.5 rounded-full text-[11px] font-sans font-semibold"
                style={{
                  backgroundColor: colors.accentSoft,
                  color: colors.accentDark,
                }}
              >
                15 Marks Long Form
              </span>
            </div>

            {/* Section 1: Theoretical Foundation */}
            <section
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-2.5"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
                1. Introduction &amp; Theoretical Foundation
              </h2>
              <p className="text-xs sm:text-sm leading-[1.75]" style={{ color: colors.ink }}>
                {notes.fifteenMarks.theoreticalFoundation}
              </p>
            </section>

            {/* Section 2: Formal Definitions Breakdown */}
            <section
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3.5"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
                2. Formal Principles &amp; Mathematical Criteria
              </h2>
              <div className="space-y-3">
                {notes.fifteenMarks.formalDefinitions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border text-xs sm:text-sm"
                    style={{
                      backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
                      borderColor: colors.border,
                    }}
                  >
                    <div className="font-sans font-semibold mb-1" style={{ color: colors.accentDark }}>
                      {item.term}
                    </div>
                    <p className="leading-relaxed opacity-90" style={{ color: colors.ink }}>
                      {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Comparative Analysis Table */}
            <section
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3 overflow-x-auto"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <h2 className="text-base sm:text-lg font-sans font-bold tracking-tight">
                3. Comparative Analysis (Marking Rubric Focus)
              </h2>
              <div className="w-full overflow-x-auto rounded-2xl border" style={{ borderColor: colors.border }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className="border-b font-sans font-semibold"
                      style={{
                        backgroundColor: colors.accentSoft,
                        borderColor: colors.border,
                        color: colors.accentDark,
                      }}
                    >
                      {notes.fifteenMarks.comparisonTable.headers.map((h, i) => (
                        <th key={i} className="p-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: colors.border }}>
                    {notes.fifteenMarks.comparisonTable.rows.map((row, rowIdx) => (
                      <tr
                        key={rowIdx}
                        className="transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                      >
                        <td className="p-3 font-semibold whitespace-nowrap" style={{ color: colors.ink }}>
                          {row[0]}
                        </td>
                        <td className="p-3 leading-relaxed" style={{ color: colors.ink }}>
                          {row[1]}
                        </td>
                        <td className="p-3 leading-relaxed" style={{ color: colors.ink }}>
                          {row[2]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 4: Visual Architecture Diagram */}
            <section
              className="p-4 sm:p-5 rounded-3xl border flex flex-col gap-2 font-mono text-xs overflow-x-auto"
              style={{
                backgroundColor: isDarkMode ? "#141113" : "#F8F6F7",
                borderColor: colors.border,
              }}
            >
              <div className="flex items-center justify-between text-[11px] font-sans font-semibold opacity-70">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" style={{ color: colors.accentDark }} />
                  <span>{notes.fifteenMarks.diagramLabel}</span>
                </span>
                <span className="text-[10px] opacity-60">Full Exam Diagram</span>
              </div>
              <pre className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 whitespace-pre leading-relaxed font-mono text-[11px] sm:text-xs overflow-x-auto">
                {notes.fifteenMarks.diagramContent}
              </pre>
            </section>

            {/* Section 5: Comprehensive Worked Problem */}
            <section
              className="p-5 sm:p-6 rounded-3xl border flex flex-col gap-3"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold font-sans" style={{ color: colors.accentDark }}>
                  5. Full Worked Numerical / Proof
                </span>
                <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/20" style={{ color: colors.accentDark }}>
                  University Standard
                </span>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-body">
                <div>
                  <strong className="font-semibold">Relation: </strong>
                  <code>{notes.fifteenMarks.workedProblem.relation}</code>
                </div>
                <div>
                  <strong className="font-semibold">Functional Dependencies: </strong>
                  <ul className="list-disc list-inside mt-0.5 pl-2 opacity-90">
                    {notes.fifteenMarks.workedProblem.functionalDependencies.map((fd, i) => (
                      <li key={i}>{fd}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong className="font-semibold">Candidate Keys: </strong>
                  <span>{notes.fifteenMarks.workedProblem.candidateKeys}</span>
                </div>
                <p className="leading-relaxed pt-1" style={{ color: colors.ink }}>
                  <strong className="font-semibold">Analysis: </strong>
                  {notes.fifteenMarks.workedProblem.analysis}
                </p>
                <div
                  className="p-3 rounded-xl bg-white/80 dark:bg-black/30 border text-xs font-sans font-medium"
                  style={{ borderColor: colors.accent, color: colors.accentDark }}
                >
                  ✓ {notes.fifteenMarks.workedProblem.conclusion}
                </div>
              </div>
            </section>

            {/* Source Citation */}
            <div className="text-right text-[11px] font-body opacity-60 italic" style={{ color: colors.inkMuted }}>
              Grounding: {notes.fifteenMarks.sourceCitation}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════════════════
            LAST-NIGHT CRASH REVISION VIEW
        ══════════════════════════════════════════════════════ */}
        {activeFormat === "crashRevision" && (
          <motion.div
            key="crashRevision"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 font-body"
          >
            {/* Header Alert */}
            <div
              className="p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <div>
                  <div className="text-xs font-sans font-bold uppercase tracking-wide" style={{ color: colors.accentDark }}>
                    Last-Night Quick Revision
                  </div>
                  <div className="text-xs font-body opacity-75" style={{ color: colors.ink }}>
                    {notes.crashRevision.makautRepeatAlert}
                  </div>
                </div>
              </div>
            </div>

            {/* High-yield Takeaway Checklist */}
            <div
              className="p-5 sm:p-6 rounded-3xl border shadow-sm transition-all flex flex-col gap-3"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
              }}
            >
              <h3 className="text-sm sm:text-base font-sans font-bold tracking-tight">
                Must-Memorize Exam Points
              </h3>
              <div className="space-y-2.5">
                {notes.crashRevision.highYieldPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: colors.accentDark }}
                    />
                    <span style={{ color: colors.ink }}>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Exam Mistake Alert */}
            <div
              className="p-4 sm:p-5 rounded-2xl border flex items-start gap-3"
              style={{
                backgroundColor: isDarkMode ? "#2A181C" : "#FDF0F2",
                borderColor: "#F3C5CD",
              }}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#9E3E4F] mt-0.5" />
              <div className="space-y-0.5">
                <div className="text-xs uppercase tracking-wider font-semibold font-sans text-[#9E3E4F]">
                  Common MAKAUT Penalty Trap
                </div>
                <p className="text-xs sm:text-sm font-body leading-relaxed text-[#5A252E]">
                  {notes.crashRevision.commonExamMistake}
                </p>
              </div>
            </div>

            {/* Mnemonic Pill */}
            <div
              className="p-3.5 rounded-2xl border text-center text-xs font-sans font-semibold"
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
                color: colors.accentDark,
              }}
            >
              🔑 Mnemonic: {notes.crashRevision.quickMnemonic}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          BILINGUAL HINGLISH / BENGALI EXPLANATION DRAWER
      ══════════════════════════════════════════════════════ */}
      <div
        className="p-4 rounded-2xl border transition-colors duration-200 mt-2"
        style={{
          backgroundColor: isDarkMode ? "#1B1719" : "#FAF8F7",
          borderColor: colors.border,
        }}
      >
        <button
          type="button"
          onClick={() => setShowBilingual((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs font-sans font-semibold transition-opacity hover:opacity-80 active:scale-[0.99]"
          style={{ color: colors.ink }}
        >
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4" style={{ color: colors.accentDark }} />
            <span>Need concept in simple Hinglish or Bengali?</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showBilingual ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {showBilingual && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden pt-3 mt-2 border-t space-y-3"
              style={{ borderColor: colors.border }}
            >
              {/* Language Toggle Pills & 1-Click Audio Reader */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectLang("hinglish")}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        bilingualLang === "hinglish" ? colors.accentDark : colors.cardBg,
                      color: bilingualLang === "hinglish" ? "#FFFFFF" : colors.inkMuted,
                    }}
                  >
                    Hinglish
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectLang("bengali")}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-sans font-semibold transition-all active:scale-95"
                    style={{
                      backgroundColor:
                        bilingualLang === "bengali" ? colors.accentDark : colors.cardBg,
                      color: bilingualLang === "bengali" ? "#FFFFFF" : colors.inkMuted,
                    }}
                  >
                    বাংলা (Bengali)
                  </button>
                </div>

                {/* 1-Click Native Audio Player */}
                <button
                  type="button"
                  onClick={handleToggleAudio}
                  aria-label={isPlayingAudio ? "Stop Audio" : "Listen to Explanation"}
                  className="min-h-[38px] px-3 py-1.5 rounded-xl text-xs font-sans font-semibold border flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                  style={{
                    backgroundColor: isPlayingAudio ? "#EAF3E8" : colors.cardBg,
                    borderColor: isPlayingAudio ? "#A9C5A7" : colors.border,
                    color: isPlayingAudio ? "#2E5929" : colors.ink,
                  }}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-emerald-700 animate-pulse" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5" style={{ color: colors.accentDark }} />
                      <span>Listen ({bilingualLang === "hinglish" ? "Hinglish" : "বাংলা"})</span>
                    </>
                  )}
                </button>
              </div>

              {/* Translation Text */}
              <p
                className="text-xs sm:text-sm font-body leading-relaxed p-3 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02]"
                style={{ borderColor: colors.border, color: colors.ink }}
              >
                {bilingualLang === "hinglish"
                  ? notes.bilingualExplanation.hinglish
                  : notes.bilingualExplanation.bengali}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
