import type { PracticeQuestion } from "./practice-data";
import { parseFeedback, resolveModel, type FeedbackResult } from "./feedback-schema";

const JSON_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "steps", "tip", "practice"],
  properties: {
    summary: { type: "string" },
    steps: { type: "array", items: { type: "string" } },
    tip: { type: "string" },
    practice: {
      type: "object",
      additionalProperties: false,
      required: ["question", "options", "hint"],
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        hint: { type: "string" },
      },
    },
  },
};

const SYSTEM = `Sən Azərbaycan məktəb şagirdləri üçün səbirli və mehriban müəllimsən. YALNIZ Azərbaycan dilində yaz.
Şagird sualı səhv cavablandırıb. Vəzifən:
1. "summary": şagirdin hansı səhvə yol verdiyini 1-2 cümlə ilə izah et (mümkünsə seçdiyi cavaba niyə gəlmiş ola biləcəyini təxmin et).
2. "steps": düzgün həll yolunu addım-addım izah et (3-6 qısa addım).
3. "tip": gələcəkdə belə səhvin qarşısını almaq üçün bir məsləhət.
4. "practice": eyni mövzuda YENİ, oxşar bir məşq sualı yarat: "question", dəqiq 4 variantlı "options" və "hint" (kiçik ipucu).
VACİB: Yeni məşq sualının cavabını, həllini və ya düzgün variantını HEÇ YERDƏ vermə. İpucu cavabı açıq göstərməməlidir.
Cavabı yalnız JSON obyekti kimi qaytar.`;

export async function generateFeedback(q: PracticeQuestion, selectedIndex: number, signal?: AbortSignal): Promise<FeedbackResult> {
  const apiKey = process.env["OPENROUTER_API_KEY"];
  if (!apiKey) {
    return { ok: false, code: "config", message: "AI xidməti hələ qurulmayıb. Zəhmət olmasa, sonra yenidən cəhd et." };
  }
  const model = resolveModel(process.env["OPENROUTER_MODEL"]);

  const userPrompt = [
    `Fənn: ${q.subject}`,
    `Mövzu konteksti: ${q.context}`,
    `Sual: ${q.text}`,
    `Variantlar: ${q.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join("; ")}`,
    `Şagirdin seçdiyi cavab: ${q.options[selectedIndex]}`,
    `Düzgün cavab: ${q.options[q.correctIndex]}`,
  ].join("\n");

  let res: Response;
  try {
    res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: signal ?? null,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "X-Title": "Yolum",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_schema", json_schema: { name: "feedback", strict: true, schema: JSON_SCHEMA } },
        max_tokens: 1500,
      }),
    });
  } catch (e) {
    console.error("OpenRouter network error", e);
    return { ok: false, code: "upstream", message: "AI xidmətinə qoşulmaq mümkün olmadı. Bir az sonra yenidən cəhd et." };
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("OpenRouter error", res.status, detail.slice(0, 500));
    if (res.status === 429) return { ok: false, code: "rate_limit", message: "Çox sayda sorğu göndərildi. Bir dəqiqə gözləyib yenidən cəhd et." };
    if (res.status === 402) return { ok: false, code: "credits", message: "AI xidmətinin balansı bitib. Müəllimə və ya administratora xəbər ver." };
    if (res.status === 401 || res.status === 403) return { ok: false, code: "config", message: "AI xidmətinin açarı yanlışdır və ya icazə yoxdur." };
    return { ok: false, code: "upstream", message: "AI xidməti hazırda cavab vermir. Bir az sonra yenidən cəhd et." };
  }

  const data = (await res.json().catch(() => null)) as { choices?: { message?: { content?: string } }[] } | null;
  const content = data?.choices?.[0]?.message?.content ?? "";
  const feedback = parseFeedback(content);
  if (!feedback) {
    console.error("OpenRouter invalid response", content.slice(0, 500));
    return { ok: false, code: "invalid_response", message: "AI-dan gələn cavab düzgün formatda deyildi. Yenidən cəhd et." };
  }
  return { ok: true, feedback };
}
