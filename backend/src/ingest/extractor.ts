import { PDFParse } from "pdf-parse";

export interface ExtractedDocument {
  text: string;
  pageCount: number;
  sourceType: "pdf" | "text" | "pasted";
  isScannedSuspect: boolean;
}

/**
 * Clean and normalize extracted text:
 * - Fixes hyphenated line breaks (e.g. "nor- \n malization" -> "normalization")
 * - Removes repeated header/footer noise (e.g. "Page 1 of 40")
 * - Cleans excessive whitespace while preserving paragraph structure
 */
export function cleanText(rawText: string): string {
  if (!rawText) return "";

  return (
    rawText
      // Replace CRLF with LF
      .replace(/\r\n/g, "\n")
      // Re-join hyphenated words across linebreaks
      .replace(/(\w+)-\s*\n\s*(\w+)/g, "$1$2")
      // Strip standalone page number footers
      .replace(/\n\s*(?:Page|PAGE)?\s*\d+\s*(?:of|\/)\s*\d+\s*\n/gi, "\n\n")
      .replace(/\n\s*[-—]\s*\d+\s*[-—]\s*\n/g, "\n\n")
      // Replace 3+ consecutive newlines with 2
      .replace(/\n{3,}/g, "\n\n")
      // Clean trailing whitespace on lines
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      .trim()
  );
}

/**
 * Extract text from a digital PDF buffer using pdf-parse
 */
export async function extractFromPdf(buffer: Buffer): Promise<ExtractedDocument> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();

  const cleaned = cleanText(result.text || "");
  const pageCount = result.total || 1;

  // A digital PDF with 10 pages having less than 150 characters is likely a scanned image
  const avgCharsPerPage = cleaned.length / Math.max(1, pageCount);
  const isScannedSuspect = avgCharsPerPage < 30 && pageCount >= 1;

  return {
    text: cleaned,
    pageCount,
    sourceType: "pdf",
    isScannedSuspect,
  };
}

/**
 * Extract from raw text / markdown or pasted text
 */
export function extractFromText(rawText: string, sourceType: "text" | "pasted" = "pasted"): ExtractedDocument {
  const cleaned = cleanText(rawText);
  return {
    text: cleaned,
    pageCount: Math.max(1, Math.ceil(cleaned.length / 2500)),
    sourceType,
    isScannedSuspect: false,
  };
}
