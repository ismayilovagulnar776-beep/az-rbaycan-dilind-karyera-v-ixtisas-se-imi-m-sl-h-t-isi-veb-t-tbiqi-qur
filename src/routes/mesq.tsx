import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, Loader2, RotateCcw } from "lucide-react";
import { PRACTICE_QUESTIONS } from "@/lib/practice-data";
import { getFeedback } from "@/lib/feedback.functions";
import type { Feedback } from "@/lib/feedback-schema";

export const Route = createFileRoute("/mesq")({
  head: () => ({
    meta: [
      { title: "Məşq testi — Yolum" },
      { name: "description", content: "Məktəb fənləri üzrə suallar, səhvlərin addım-addım AI izahı və oxşar məşq sualları." },
      { property: "og:title", content: "Məşq testi — Yolum" },
      { property: "og:description", content: "Səhvlərini AI ilə addım-addım başa düş." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PracticePage,
});

type State =
  | { kind: "idle" }
  | { kind: "correct" }
  | { kind: "loading" }
  | { kind: "feedback"; feedback: Feedback }
  | { kind: "error"; message: string };

function PracticePage() {
  const fetchFeedback = useServerFn(getFeedback);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [revealedHint, setRevealedHint] = useState(false);
  const q = PRACTICE_QUESTIONS[index]!;
  const total = PRACTICE_QUESTIONS.length;
  const answered = state.kind !== "idle";

  const requestFeedback = async (sel: number) => {
    setState({ kind: "loading" });
    try {
      const r = await fetchFeedback({ data: { questionId: q.id, selectedIndex: sel } });
      setState(r.ok ? { kind: "feedback", feedback: r.feedback } : { kind: "error", message: r.message });
    } catch {
      setState({ kind: "error", message: "Bağlantı xətası baş verdi. İnterneti yoxla və yenidən cəhd et." });
    }
  };

  const check = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) setState({ kind: "correct" });
    else void requestFeedback(selected);
  };

  const next = () => {
    setIndex((i) => (i + 1) % total);
    setSelected(null);
    setState({ kind: "idle" });
    setRevealedHint(false);
  };

  return (
    <main className="min-h-screen bg-gradient-soft">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-14">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Ana səhifə</Link>
          <span>Sual {index + 1} / {total}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-hero transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        <div key={q.id} className="animate-fade-up mt-10 rounded-3xl bg-card p-6 shadow-card sm:p-10">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{q.subject}</span>
          <h2 className="mt-4 text-xl font-semibold leading-snug sm:text-2xl">{q.text}</h2>
          <div className="mt-6 grid gap-3">
            {q.options.map((opt, i) => {
              const isSel = selected === i;
              const showCorrect = answered && state.kind !== "loading" && i === q.correctIndex;
              const showWrong = answered && isSel && i !== q.correctIndex;
              return (
                <button
                  key={opt}
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left font-medium transition-all ${
                    showCorrect
                      ? "border-teal-accent bg-accent"
                      : showWrong
                        ? "border-destructive bg-destructive/10"
                        : isSel
                          ? "border-primary bg-secondary"
                          : "border-border bg-background hover:border-primary"
                  }`}
                >
                  <span>{String.fromCharCode(65 + i)}) {opt}</span>
                  {showCorrect && <CheckCircle2 className="h-5 w-5 text-teal-accent" />}
                  {showWrong && <XCircle className="h-5 w-5 text-destructive" />}
                </button>
              );
            })}
          </div>

          {!answered && (
            <button
              onClick={check}
              disabled={selected === null}
              className="mt-6 w-full rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-card disabled:opacity-50"
            >
              Cavabı yoxla
            </button>
          )}
        </div>

        {state.kind === "correct" && (
          <div className="animate-fade-up mt-6 rounded-3xl bg-card p-6 shadow-soft">
            <p className="flex items-center gap-2 font-semibold text-teal-accent"><CheckCircle2 className="h-5 w-5" /> Əla, düzgün cavab!</p>
          </div>
        )}

        {state.kind === "loading" && (
          <div className="mt-6 flex items-center gap-3 rounded-3xl bg-card p-6 text-muted-foreground shadow-soft">
            <Loader2 className="h-5 w-5 animate-spin text-primary" /> Səhvin təhlil edilir…
          </div>
        )}

        {state.kind === "error" && (
          <div className="mt-6 rounded-3xl bg-card p-6 shadow-soft">
            <p className="text-sm text-destructive">{state.message}</p>
            <button
              onClick={() => selected !== null && requestFeedback(selected)}
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <RotateCcw className="h-4 w-4" /> Yenidən cəhd et
            </button>
          </div>
        )}

        {state.kind === "feedback" && (
          <div className="animate-fade-up mt-6 space-y-5 rounded-3xl bg-card p-6 shadow-card sm:p-8">
            <div>
              <h3 className="font-semibold">Səhv harada oldu?</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{state.feedback.summary}</p>
            </div>
            <div>
              <h3 className="font-semibold">Addım-addım həll</h3>
              <ol className="mt-2 space-y-2">
                {state.feedback.steps.map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-hero text-xs font-bold text-primary-foreground">{i + 1}</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="flex gap-2 rounded-2xl bg-accent p-4 text-sm text-accent-foreground">
              <Lightbulb className="h-5 w-5 shrink-0" /> {state.feedback.tip}
            </p>
            <div className="rounded-2xl border-2 border-dashed border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-accent">Oxşar məşq sualı</p>
              <p className="mt-2 font-medium">{state.feedback.practice.question}</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {state.feedback.practice.options.map((o, i) => (
                  <li key={i} className="rounded-xl bg-secondary px-3 py-2 text-sm">{String.fromCharCode(65 + i)}) {o}</li>
                ))}
              </ul>
              {revealedHint ? (
                <p className="mt-3 text-sm text-muted-foreground">İpucu: {state.feedback.practice.hint}</p>
              ) : (
                <button onClick={() => setRevealedHint(true)} className="mt-3 text-sm font-medium text-primary hover:underline">İpucunu göstər</button>
              )}
            </div>
          </div>
        )}

        {(state.kind === "correct" || state.kind === "feedback" || state.kind === "error") && (
          <div className="mt-6 flex justify-end">
            <button onClick={next} className="inline-flex items-center gap-2 rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-card">
              Növbəti sual <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
