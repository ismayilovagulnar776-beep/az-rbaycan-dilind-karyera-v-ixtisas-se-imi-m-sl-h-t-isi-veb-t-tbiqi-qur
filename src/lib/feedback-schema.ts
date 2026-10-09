import { z } from "zod";

export const feedbackSchema = z.object({
  summary: z.string().trim().min(1),
  steps: z.array(z.string().trim().min(1)).min(1).max(8),
  tip: z.string().trim().min(1),
  practice: z.object({
    question: z.string().trim().min(1),
    options: z.array(z.string().trim().min(1)).length(4),
    hint: z.string().trim().min(1),
  }),
});

export type Feedback = z.infer<typeof feedbackSchema>;

export type FeedbackResult =
  | { ok: true; feedback: Feedback }
  | { ok: false; code: "rate_limit" | "credits" | "config" | "invalid_response" | "upstream" | "bad_input"; message: string };

/** Parses raw model text into validated feedback, or null if invalid. */
export function parseFeedback(raw: string): Feedback | null {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/```$/, "").trim();
  try {
    const result = feedbackSchema.safeParse(JSON.parse(cleaned));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export const SUPPORTED_MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-flash-lite",
  "openai/gpt-4.1-mini",
  "openai/gpt-5-mini",
] as const;
export const DEFAULT_MODEL = "google/gemini-2.5-flash";

/** Picks the configured model if it is supported; otherwise the default. */
export function resolveModel(configured: string | undefined): string {
  const m = configured?.trim();
  return m && (SUPPORTED_MODELS as readonly string[]).includes(m) ? m : DEFAULT_MODEL;
}
