import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, ArrowRight, ListChecks, Target, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yolum — Karyera və ixtisas seçimi məsləhətçisi" },
      { name: "description", content: "Qısa maraq testi ilə sənə ən uyğun ixtisasları kəşf et və AI məsləhətçidən sual soruş." },
      { property: "og:title", content: "Yolum — Karyera və ixtisas seçimi" },
      { property: "og:description", content: "12 suallıq test, top 3 ixtisas və AI məsləhətçi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  { icon: ListChecks, title: "12 sual", text: "Maraqlarını 1-5 şkala ilə qiymətləndir" },
  { icon: Target, title: "Top 3 ixtisas", text: "Sənə ən uyğun sahələri gör" },
  { icon: MessageCircle, title: "AI məsləhətçi", text: "Peşələr haqqında sual ver" },
];

function Index() {
  return (
    <main className="min-h-screen bg-gradient-soft">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-5 py-16 text-center sm:py-24">
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero shadow-card">
          <Compass className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight sm:text-6xl">
          Gələcəyini <span className="text-gradient">özün seç</span>
        </h1>
        <p className="animate-fade-up mt-5 max-w-xl text-lg text-muted-foreground">
          Bir neçə dəqiqəlik maraq testi ilə sənə ən uyğun ixtisasları kəşf et. Sonra AI məsləhətçimizdən
          istədiyin sualı soruş.
        </p>
        <Link
          to="/test"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-hero px-8 py-4 text-lg font-semibold text-primary-foreground shadow-card transition-transform hover:scale-105"
        >
          Testə başla <ArrowRight className="h-5 w-5" />
        </Link>
        <Link to="/mesq" className="mt-4 text-sm font-medium text-primary hover:underline">
          və ya fənlər üzrə məşq testini keç →
        </Link>

        <div className="mt-16 grid w-full gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.title} className="rounded-2xl bg-card p-6 text-left shadow-soft">
              <s.icon className="h-6 w-6 text-teal-accent" />
              <h3 className="mt-3 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
