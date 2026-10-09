import { useRef, useState, useEffect } from "react";
import { Send, Compass, Square } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Bu ixtisası oxusam nə iş tapa bilərəm?",
  "Hansı universitetlərdə oxuya bilərəm?",
  "Bu peşədə maaşlar necədir?",
];

export function ChatPanel({ context }: { context?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setError(null);
    const history: Msg[] = [...messages, { role: "user", content: q }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        throw new Error(
          res.status === 429
            ? "Çox sayda sorğu göndərildi, bir az sonra yenidən cəhd et."
            : res.status === 402
              ? "AI kreditləri bitib."
              : "Cavab alınmadı. Yenidən cəhd et.",
        );
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: acc }]);
      }
      if (!acc) throw new Error("Cavab boş gəldi. Sualı yenidən yaz.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError((e as Error).message);
        setMessages((m) => (m[m.length - 1]?.content === "" ? m.slice(0, -1) : m));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <section className="flex h-[560px] flex-col overflow-hidden rounded-3xl bg-card shadow-card">
      <header className="flex items-center gap-3 bg-gradient-hero px-5 py-4 text-primary-foreground">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/20">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">AI Məsləhətçi</h2>
          <p className="text-xs opacity-90">İxtisas və peşələr haqqında soruş</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Salam! Nəticələrin haqqında nə bilmək istəyirsən?</p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full rounded-xl border border-border px-3 py-2 text-left text-sm hover:border-primary hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex"}>
            <div
              className={
                m.role === "user"
                  ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-sm text-primary-foreground"
                  : "max-w-[95%] whitespace-pre-wrap text-sm leading-relaxed"
              }
            >
              {m.content || (
                <span className="inline-flex gap-1 text-muted-foreground">
                  <span className="animate-pulse">Düşünürəm…</span>
                </span>
              )}
            </div>
          </div>
        ))}
        {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Sualını yaz…"
          className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {loading ? (
          <button
            type="button"
            onClick={() => abortRef.current?.abort()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
            aria-label="Dayandır"
          >
            <Square className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground disabled:opacity-50"
            aria-label="Göndər"
          >
            <Send className="h-4 w-4" />
          </button>
        )}
      </form>
    </section>
  );
}
