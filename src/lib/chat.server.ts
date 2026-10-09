import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId } from "./run-id";

const SYSTEM = `Sən Azərbaycanlı məktəb şagirdlərinə kömək edən mehriban karyera və ixtisas seçimi məsləhətçisisən.
Həmişə yalnız Azərbaycan dilində cavab ver. Cavabların qısa (maksimum 150 söz), aydın və ruhlandırıcı olsun.
Azərbaycan universitetləri və əmək bazarı kontekstini nəzərə al. Siyahılardan istifadə edə bilərsən.`;

export async function handleChat(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return new Response("AI açarı tapılmadı", { status: 500 });

  const body = (await request.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
    context?: string;
  };
  const messages: ModelMessage[] = body.messages.slice(-12).map((m) => ({
    role: m.role,
    content: String(m.content).slice(0, 2000),
  }));

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    system: SYSTEM + (body.context ? `\nŞagirdin test nəticələri: ${body.context}` : ""),
    messages,
    abortSignal: request.signal,
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  return result.toTextStreamResponse();
}
