import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

export interface GenerationRequest {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: "json" | "text";
  temperature?: number;
}

export interface GenerationResponse {
  text: string;
  provider: "groq" | "openrouter" | "gemini" | "extractive_fallback";
  model: string;
  elapsedMs: number;
}

const GROQ_KEY = process.env.GROQ_API_KEY || "";
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || "";
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";

/**
 * 1. Call Groq (Primary High-Speed Tier)
 */
async function callGroq(req: GenerationRequest): Promise<string> {
  if (!GROQ_KEY) throw new Error("GROQ_API_KEY not configured");

  const models = ["openai/gpt-oss-120b", "qwen/qwen3.8-27b"];
  let lastErr = "";

  for (const model of models) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: req.systemPrompt },
            { role: "user", content: req.userPrompt },
          ],
          temperature: req.temperature ?? 0.2,
          ...(req.responseFormat === "json"
            ? { response_format: { type: "json_object" } }
            : {}),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastErr = `Groq ${model} (${res.status}): ${errText}`;
        console.warn(`[AIGateway] ${lastErr}`);
        continue;
      }

      const data: any = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim()) {
        return content.trim();
      }
    } catch (e: any) {
      lastErr = e.message;
      console.warn(`[AIGateway] Groq exception for ${model}:`, e.message);
    }
  }

  throw new Error(`Groq failed: ${lastErr}`);
}

/**
 * 2. Call OpenRouter (Secondary Free 1M Context Tier)
 */
async function callOpenRouter(req: GenerationRequest): Promise<string> {
  if (!OPENROUTER_KEY) throw new Error("OPENROUTER_API_KEY not configured");

  const freeModels = [
    "nvidia/nemotron-3.5-lightning:free",
    "baidu/ernie-5.5-flash-preview:free",
  ];
  let lastErr = "";

  for (const model of freeModels) {
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://studify.app",
          "X-Title": "Studify",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: req.systemPrompt },
            { role: "user", content: req.userPrompt },
          ],
          temperature: req.temperature ?? 0.2,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastErr = `OpenRouter ${model} (${res.status}): ${errText}`;
        console.warn(`[AIGateway] ${lastErr}`);
        continue;
      }

      const data: any = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content && content.trim()) {
        return content.trim();
      }
    } catch (e: any) {
      lastErr = e.message;
      console.warn(`[AIGateway] OpenRouter exception for ${model}:`, e.message);
    }
  }

  throw new Error(`OpenRouter failed: ${lastErr}`);
}

/**
 * 3. Call Gemini (Google AI Studio Tier)
 */
async function callGemini(req: GenerationRequest): Promise<string> {
  if (!GEMINI_KEY) throw new Error("GEMINI_API_KEY not configured");

  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-flash"];
  let lastErr = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: req.systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: req.userPrompt }] }],
          generationConfig: {
            temperature: req.temperature ?? 0.2,
            ...(req.responseFormat === "json"
              ? { responseMimeType: "application/json" }
              : {}),
          },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        lastErr = `Gemini ${model} (${res.status}): ${errText}`;
        continue;
      }

      const data: any = await res.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content && content.trim()) {
        return content.trim();
      }
    } catch (e: any) {
      lastErr = e.message;
    }
  }

  throw new Error(`Gemini failed: ${lastErr}`);
}

/**
 * 4. Main Resilient Gateway Dispatcher
 * Automatically tries: Groq -> OpenRouter -> Gemini -> Extractive Fallback
 */
export async function generateWithFallback(
  req: GenerationRequest
): Promise<GenerationResponse> {
  const startTime = Date.now();

  // Tier 1: Try Groq
  try {
    const text = await callGroq(req);
    const elapsedMs = Date.now() - startTime;
    console.log(`[AIGateway] ✅ Generated via Groq in ${elapsedMs}ms`);
    return { text, provider: "groq", model: "openai/gpt-oss-120b", elapsedMs };
  } catch (err: any) {
    console.warn("[AIGateway] Groq failed, switching to OpenRouter:", err.message);
  }

  // Tier 2: Try OpenRouter Free
  try {
    const text = await callOpenRouter(req);
    const elapsedMs = Date.now() - startTime;
    console.log(`[AIGateway] ✅ Generated via OpenRouter in ${elapsedMs}ms`);
    return {
      text,
      provider: "openrouter",
      model: "nvidia/nemotron-3.5-lightning:free",
      elapsedMs,
    };
  } catch (err: any) {
    console.warn("[AIGateway] OpenRouter failed, switching to Gemini:", err.message);
  }

  // Tier 3: Try Gemini
  try {
    const text = await callGemini(req);
    const elapsedMs = Date.now() - startTime;
    console.log(`[AIGateway] ✅ Generated via Gemini in ${elapsedMs}ms`);
    return { text, provider: "gemini", model: "gemini-2.0-flash", elapsedMs };
  } catch (err: any) {
    console.warn("[AIGateway] Gemini failed:", err.message);
  }

  throw new Error("All AI providers in fallback chain failed.");
}
