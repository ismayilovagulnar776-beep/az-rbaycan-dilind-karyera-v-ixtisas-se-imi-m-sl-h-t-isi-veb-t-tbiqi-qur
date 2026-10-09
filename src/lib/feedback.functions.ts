import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPracticeQuestion } from "./practice-data";
import type { FeedbackResult } from "./feedback-schema";

export const getFeedback = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ questionId: z.string().max(64), selectedIndex: z.number().int().min(0).max(3) }).parse(data),
  )
  .handler(async ({ data }): Promise<FeedbackResult> => {
    const q = getPracticeQuestion(data.questionId);
    if (!q) return { ok: false, code: "bad_input", message: "Sual tapılmadı." };
    if (data.selectedIndex === q.correctIndex) {
      return { ok: false, code: "bad_input", message: "Cavab düzgündür, izaha ehtiyac yoxdur." };
    }
    const { generateFeedback } = await import("./feedback.server");
    return generateFeedback(q, data.selectedIndex);
  });
