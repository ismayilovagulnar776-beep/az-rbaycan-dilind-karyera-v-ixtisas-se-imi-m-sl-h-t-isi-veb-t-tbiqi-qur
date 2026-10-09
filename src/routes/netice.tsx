import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, RotateCcw } from "lucide-react";
import { computeResults, type Specialty } from "@/lib/quiz-data";
import { ChatPanel } from "@/components/ChatPanel";

export const Route = createFileRoute("/netice")({
  head: () => ({
    meta: [
      { title: "Nəticələrin — Yolum" },
      { name: "description", content: "Sənə ən uyğun 3 ixtisas və AI məsləhətçi ilə söhbət." },
      { property: "og:title", content: "Nəticələrin — Yolum" },
      { property: "og:description", content: "Top 3 uyğun ixtisas, uyğunluq faizi və mümkün peşələr." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResultPage,
});

type Result = { specialty: Specialty; percent: number };

function ResultPage() {
  const [results, setResults] = useState<Result[] | null>(null);

  useEffect(() => {
    let answers: number[] = [];
    try {
      answers = JSON.parse(sessionStorage.getItem("quiz-answers") || "[]");
    } catch {
      answers = [];
    }
    if (!answers.length) answers = [5, 3, 4, 2, 3, 4, 3, 3, 2, 3, 4, 3];
    setResults(computeResults(answers));
  }, []);

  const context = results?.map((r) => `${r.specialty.name} (${r.percent}%)`).join(", ");

  return (
    <main className="min-h-screen bg-gradient-soft">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-teal-accent">Test tamamlandı</p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Sənə ən uyğun ixtisaslar</h1>
          </div>
          <Link to="/test" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <RotateCcw className="h-4 w-4" /> Testi yenidən keç
          </Link>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-5">
            {results?.map((r, i) => (
              <article
                key={r.specialty.id}
                className="animate-fade-up rounded-3xl bg-card p-6 shadow-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      #{i + 1}
                    </span>
                    <h2 className="text-xl font-bold sm:text-2xl">{r.specialty.name}</h2>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gradient">{r.percent}%</div>
                    <div className="text-xs text-muted-foreground">uyğunluq</div>
                  </div>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-hero" style={{ width: `${r.percent}%` }} />
                </div>
                <h3 className="mt-5 text-sm font-semibold">Niyə uyğundur?</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{r.specialty.reason}</p>
                <h3 className="mt-5 flex items-center gap-1.5 text-sm font-semibold">
                  <Briefcase className="h-4 w-4 text-teal-accent" /> Mümkün peşələr
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.specialty.careers.map((c) => (
                    <span key={c} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      {c}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <ChatPanel context={context} />
          </div>
        </div>
      </div>
    </main>
  );
}
