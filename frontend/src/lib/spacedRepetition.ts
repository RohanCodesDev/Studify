/**
 * SuperMemo 2 (SM-2) Spaced Repetition Algorithm
 * Deterministic calculation for optimal revision schedules.
 */

export interface SM2Input {
  correctCount: number;
  totalQuestions: number;
  previousEaseFactor?: number;
  previousIntervalDays?: number;
  repetitionNumber?: number;
  missedSubtopics: string[];
}

export interface SM2Output {
  quality: number; // 0 to 5
  accuracyPercent: number;
  easeFactor: number;
  intervalDays: number;
  nextReviewDate: string;
  nextReviewLabel: string;
  masteryLevel: "Mastered" | "Proficient" | "Needs Attention";
  weakSubtopics: string[];
}

export function calculateSM2(input: SM2Input): SM2Output {
  const {
    correctCount,
    totalQuestions,
    previousEaseFactor = 2.5,
    previousIntervalDays = 1,
    repetitionNumber = 1,
    missedSubtopics = [],
  } = input;

  const accuracyPercent = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);

  // Map accuracy percentage to SM-2 quality grade (0 - 5)
  // 5: 90 - 100% (perfect recall)
  // 4: 80 - 89% (hesitation, but correct)
  // 3: 65 - 79% (serious difficulty, but pass)
  // 2: 50 - 64% (incorrect, familiar)
  // 1: 30 - 49% (incorrect, vaguely remembered)
  // 0: < 30% (complete blackout)
  let quality: number;
  if (accuracyPercent >= 90) quality = 5;
  else if (accuracyPercent >= 80) quality = 4;
  else if (accuracyPercent >= 65) quality = 3;
  else if (accuracyPercent >= 50) quality = 2;
  else if (accuracyPercent >= 30) quality = 1;
  else quality = 0;

  // Calculate new Ease Factor (EF)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEaseFactor =
    previousEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEaseFactor < 1.3) newEaseFactor = 1.3;

  // Calculate new interval in days
  let intervalDays: number;
  if (quality < 3) {
    // Failed: reset interval to tomorrow
    intervalDays = 1;
  } else {
    if (repetitionNumber <= 1) {
      intervalDays = quality >= 4 ? 3 : 2;
    } else if (repetitionNumber === 2) {
      intervalDays = quality >= 4 ? 6 : 4;
    } else {
      intervalDays = Math.round(previousIntervalDays * newEaseFactor);
    }
  }

  // Calculate next review calendar date
  const reviewDate = new Date();
  reviewDate.setDate(reviewDate.getDate() + intervalDays);
  const formattedReviewDate = reviewDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  let nextReviewLabel = "";
  if (intervalDays === 1) {
    nextReviewLabel = "Tomorrow";
  } else if (intervalDays <= 3) {
    nextReviewLabel = `In ${intervalDays} days (${formattedReviewDate})`;
  } else {
    nextReviewLabel = `In ${intervalDays} days (${formattedReviewDate})`;
  }

  let masteryLevel: "Mastered" | "Proficient" | "Needs Attention";
  if (accuracyPercent >= 80) {
    masteryLevel = "Mastered";
  } else if (accuracyPercent >= 60) {
    masteryLevel = "Proficient";
  } else {
    masteryLevel = "Needs Attention";
  }

  // Deduplicate weak subtopics
  const weakSubtopics = Array.from(new Set(missedSubtopics));

  return {
    quality,
    accuracyPercent,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    intervalDays,
    nextReviewDate: formattedReviewDate,
    nextReviewLabel,
    masteryLevel,
    weakSubtopics,
  };
}
