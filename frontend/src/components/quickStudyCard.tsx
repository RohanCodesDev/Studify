"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, X, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

// ─── Tweakable layout config ───────────────────────────────────────────────
export const QUICK_STUDY_CONFIG = {
  cardPadding: "p-5 sm:p-6",
  cardRadius: "rounded-3xl",
  dropzoneRadius: "rounded-2xl",
  textareaRadius: "rounded-2xl",
  buttonRadius: "rounded-2xl",
  buttonMinHeight: "46px",
};

export interface QuickStudyPayload {
  file: File | null;
  text: string;
}

interface QuickStudyCardProps {
  onStartQuickStudy?: (payload: QuickStudyPayload) => void;
  className?: string;
}

export default function QuickStudyCard({
  onStartQuickStudy,
  className = "",
}: QuickStudyCardProps) {
  const { colors, isDarkMode } = useTheme();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !pastedText.trim()) return;

    if (onStartQuickStudy) {
      onStartQuickStudy({
        file: selectedFile,
        text: pastedText.trim(),
      });
    } else {
      // Default stub action
      console.log("Quick study submitted:", { file: selectedFile?.name, text: pastedText.trim() });
    }
  };

  const isActionReady = Boolean(selectedFile || pastedText.trim().length > 0);

  // Format file size nicely
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`w-full ${QUICK_STUDY_CONFIG.cardRadius} border shadow-sm transition-all duration-300 ${QUICK_STUDY_CONFIG.cardPadding} ${className}`}
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.border,
        color: colors.ink,
      }}
    >
      {/* ── Card Header ── */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wide uppercase"
              style={{
                backgroundColor: colors.accentSoft,
                color: colors.accentDark,
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Base Ingestion</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-sans font-bold tracking-tight">
            Quick Study
          </h2>
          <p
            className="text-xs sm:text-sm font-body leading-relaxed mt-0.5"
            style={{ color: colors.inkMuted }}
          >
            Drop in notes, a PDF or a photo and get clear notes.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* ── Upload Files Area ── */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            id="quick-study-file-input"
            accept=".pdf,.doc,.docx,.pptx,.txt,image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!selectedFile ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload files"
              className={`
                w-full p-5 sm:p-6 ${QUICK_STUDY_CONFIG.dropzoneRadius}
                border-2 border-dashed cursor-pointer text-center
                flex flex-col items-center justify-center gap-2
                transition-all duration-200 select-none active:scale-[0.99]
              `}
              style={{
                backgroundColor: isDragOver
                  ? colors.accentSoft
                  : isDarkMode
                    ? "#1E1A1D"
                    : "#FDFBFA",
                borderColor: isDragOver ? colors.accentDark : colors.border,
              }}
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200"
                style={{
                  backgroundColor: colors.accentSoft,
                  color: colors.accentDark,
                  transform: isDragOver ? "scale(1.1)" : "scale(1)",
                }}
              >
                <UploadCloud className="w-5 h-5" />
              </div>

              <div className="space-y-0.5">
                <span className="text-xs sm:text-sm font-sans font-medium">
                  Tap to upload or drag &amp; drop file here
                </span>
                <p
                  className="text-[11px] font-body"
                  style={{ color: colors.inkMuted }}
                >
                  Allows <strong className="font-semibold">PDF, DOC, DOCX, PPTX</strong> &amp; photos (up to 25MB)
                </p>
              </div>
            </div>
          ) : (
            /* Selected file banner */
            <div
              className={`
                w-full p-3.5 sm:p-4 ${QUICK_STUDY_CONFIG.dropzoneRadius}
                border flex items-center justify-between gap-3
                transition-all
              `}
              style={{
                backgroundColor: colors.accentSoft,
                borderColor: colors.accent,
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: colors.cardBg,
                    color: colors.accentDark,
                  }}
                >
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div
                    className="text-xs sm:text-sm font-sans font-medium truncate"
                    style={{ color: colors.ink }}
                  >
                    {selectedFile.name}
                  </div>
                  <div
                    className="text-[11px] font-body opacity-70"
                    style={{ color: colors.inkMuted }}
                  >
                    {formatFileSize(selectedFile.size)} · Ready to ingest
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                aria-label="Remove uploaded file"
                className="min-h-[36px] min-w-[36px] flex items-center justify-center rounded-xl border transition-all active:scale-95 shrink-0"
                style={{
                  backgroundColor: colors.cardBg,
                  borderColor: colors.border,
                  color: colors.inkMuted,
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── OR Section Divider ── */}
        <div className="relative flex items-center justify-center my-1 select-none">
          <div
            className="w-full border-t"
            style={{ borderColor: colors.border }}
          />
          <span
            className="absolute px-3 text-[11px] font-sans font-medium uppercase tracking-wider"
            style={{
              backgroundColor: colors.cardBg,
              color: colors.inkMuted,
            }}
          >
            or paste text
          </span>
        </div>

        {/* ── Text Ingestion Textbox ── */}
        <div>
          <label
            htmlFor="quick-study-text-input"
            className="sr-only"
          >
            Paste study notes or text
          </label>
          <textarea
            id="quick-study-text-input"
            rows={3}
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste your raw notes, assignment questions, or textbook excerpt here..."
            className={`
              w-full p-3.5 text-xs sm:text-sm font-body
              ${QUICK_STUDY_CONFIG.textareaRadius} border
              focus:outline-none transition-colors resize-y leading-relaxed
            `}
            style={{
              backgroundColor: isDarkMode ? "#1A1618" : "#FCFAF9",
              borderColor: colors.border,
              color: colors.ink,
            }}
          />
        </div>

        {/* ── Action Button ── */}
        <button
          type="submit"
          disabled={!isActionReady}
          className={`
            w-full ${QUICK_STUDY_CONFIG.buttonRadius}
            font-sans font-semibold text-xs sm:text-sm
            flex items-center justify-center gap-2
            transition-all duration-200 active:scale-[0.98] shadow-sm
          `}
          style={{
            minHeight: QUICK_STUDY_CONFIG.buttonMinHeight,
            backgroundColor: isActionReady ? colors.accentDark : colors.border,
            color: isActionReady ? "#FFFFFF" : colors.inkMuted,
            opacity: isActionReady ? 1 : 0.65,
            cursor: isActionReady ? "pointer" : "not-allowed",
            boxShadow: isActionReady ? `0 4px 16px ${colors.accent}66` : "none",
          }}
        >
          <span>Generate Quick Notes</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
