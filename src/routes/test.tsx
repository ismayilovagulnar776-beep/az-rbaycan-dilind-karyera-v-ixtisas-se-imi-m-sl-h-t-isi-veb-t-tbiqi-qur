import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { QUESTIONS } from "@/lib/quiz-data";

export const Route = createFileRoute("/test")({
  head: () => ({
    meta: [
      { title: "Maraq anketi — Yolum" },
      { name: "description", content: "12 suallıq maraq anketini cavablandır və uyğun ixtisasları tap." },
      { property: "og:title", content: "Maraq anketi — Yolum" },
      { property: "og:description", content: "12 sual, 1-5 şkala ilə maraqlarını qiymətləndir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TestPage,
});

const LABELS = ["Heç uyğun deyil", "Az uyğun", "Orta", "Uyğun", "Tam uyğun"];

function TestPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(0));
  const total = QUESTIONS.length;
  const answered = answers.filter((a) => a > 0).length;
  const current = answers[index] ?? 0;
  const isLast = index === total - 1;

  const choose = (v: number) => {
    const next = [...answers];
    next[index] = v;
    setAnswers(next);
    if (!isLast) setTimeout(() => setIndex((i) => Math.min(i + 1, total - 1)), 250);
  };

  const finish = () => {
    sessionStorage.setItem("quiz-answers", JSON.stringify(answers));
    navigate({ to: "/netice" });
  };

  return (
    <main className="min-h-screen bg-gradient-soft">
      <div className="mx-auto max-w-2xl px-5 py-8 sm:py-14">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Ana səhifə</Link>
          <span>Sual {index + 1} / {total}</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-hero transition-all duration-500"
            style={{ width: `${(answered / total) * 100}%` }}
          />
        </div>

        <div key={index} className="animate-fade-up mt-10 rounded-3xl bg-card p-6 shadow-card sm:p-10">
          <h2 className="text-xl font-semibold leading-snug sm:text-2xl">{QUESTIONS[index]?.text}</h2>
          <div className="mt-8 grid grid-cols-5 gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => choose(v)}
                className={`flex aspect-square items-center justify-center rounded-2xl border-2 text-xl font-bold transition-all ${
                  current === v
                    ? "border-transparent bg-gradient-hero text-primary-foreground shadow-card scale-105"
                    : "border-border bg-background hover:border-primary"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <span>{LABELS[0]}</span>
            <span>{LABELS[4]}</span>
          </div>
          {current > 0 && <p className="mt-4 text-center text-sm text-teal-accent">{LABELS[(current || 1) - 1]}</p>}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" /> Geri
          </button>
          {isLast ? (
            <button
              onClick={finish}
              disabled={answered < total}
              className="rounded-full bg-gradient-hero px-6 py-3 font-semibold text-primary-foreground shadow-card disabled:opacity-50"
            >
              Nəticəni göstər
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => i + 1)}
              disabled={current === 0}
              className="inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary disabled:opacity-40"
            >
              İrəli <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
