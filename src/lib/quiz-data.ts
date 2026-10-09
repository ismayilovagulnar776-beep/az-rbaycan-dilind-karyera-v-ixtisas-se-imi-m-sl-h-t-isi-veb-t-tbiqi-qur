export type Category =
  | "texnologiya"
  | "tibbi"
  | "humanitar"
  | "biznes"
  | "yaradiciliq"
  | "sosial";

export interface Question {
  text: string;
  category: Category;
}

export const QUESTIONS: Question[] = [
  { text: "Kompüter proqramları və yeni texnologiyalarla maraqlanıram", category: "texnologiya" },
  { text: "İnsanlara kömək etmək və onların problemlərini dinləmək mənə xoşdur", category: "sosial" },
  { text: "Riyaziyyat və məntiqi tapmacaları həll etməyi sevirəm", category: "texnologiya" },
  { text: "Biologiya və insan bədəni haqqında öyrənmək maraqlıdır", category: "tibbi" },
  { text: "Oxumaq, yazmaq və dilləri öyrənmək mənim üçün asandır", category: "humanitar" },
  { text: "Öz biznesimi qurmaq və ya layihələri idarə etmək istəyirəm", category: "biznes" },
  { text: "Rəsm çəkmək, dizayn etmək və ya musiqi ilə məşğul olmaq xoşuma gəlir", category: "yaradiciliq" },
  { text: "Komandada işləmək və insanları təşkil etmək mənə uyğundur", category: "biznes" },
  { text: "Elmi tədqiqatlar aparmaq və yeni şeylər kəşf etmək istəyirəm", category: "tibbi" },
  { text: "Mübahisə etmək və öz fikrimi müdafiə etmək bacarığım var", category: "humanitar" },
  { text: "Videolar, şəkillər və ya veb-saytlar yaratmaq maraqlıdır", category: "yaradiciliq" },
  { text: "Başqalarına məsləhət vermək və onlara rəhbərlik etmək istəyirəm", category: "sosial" },
];

export interface Specialty {
  id: string;
  name: string;
  category: Category;
  reason: string;
  careers: string[];
}

export const SPECIALTIES: Specialty[] = [
  {
    id: "it",
    name: "İnformasiya Texnologiyaları",
    category: "texnologiya",
    reason:
      "Texnologiyaya olan marağın və məntiqi düşünmə bacarığın bu sahə üçün ideal zəmindir. İT sektoru Azərbaycanda və dünyada ən sürətlə inkişaf edən sahələrdəndir.",
    careers: ["Proqramçı", "Vebsayt tərtibatçısı", "Məlumat analitiki", "Kibertəhlükəsizlik mütəxəssisi"],
  },
  {
    id: "muhandislik",
    name: "Mühəndislik",
    category: "texnologiya",
    reason:
      "Riyazi düşüncə tərzin və texniki məsələlərə marağın mühəndislik üçün güclü əsasdır. Bu sahə geniş iş imkanları təklif edir.",
    careers: ["Mühəndis", "Layihə rəhbəri", "Robototexnika mütəxəssisi", "Konstruktor"],
  },
  {
    id: "tibb",
    name: "Tibb",
    category: "tibbi",
    reason:
      "Təbiət elmlərinə marağın və insanlara kömək etmək istəyin tibb peşəsi üçün əla uyğunluqdur. Bu, nəcib və həmişə tələb olunan peşədir.",
    careers: ["Həkim", "Əczaçı", "Biotexnolog", "Tibbi laborant"],
  },
  {
    id: "huquq",
    name: "Hüquqşünaslıq",
    category: "humanitar",
    reason:
      "Öz fikrini müdafiə etmək bacarığın və humanitar fəaliyyətə meylin hüquq sahəsində uğur qazanmağa kömək edəcək.",
    careers: ["Vəkil", "Məhkəmə müşaviri", "Hüquq məsləhətçisi", "Notarius"],
  },
  {
    id: "jurnalistika",
    name: "Jurnalistika və Media",
    category: "humanitar",
    reason:
      "Yazı yazma qabiliyyətin və ünsiyyət bacarığın media sahəsində özünü göstərməyə imkan verəcək.",
    careers: ["Jurnalist", "Redaktor", "Kontent meneceri", "Aparıcı"],
  },
  {
    id: "biznes",
    name: "Biznes İdarəetməsi",
    category: "biznes",
    reason:
      "Liderlik keyfiyyətlərin və təşkilatçılıq bacarığın biznes dünyasında uğur üçün əsas şərtdir.",
    careers: ["Menecer", "Sahibkar", "Marketinq mütəxəssisi", "Layihə koordinatoru"],
  },
  {
    id: "dizayn",
    name: "Dizayn",
    category: "yaradiciliq",
    reason:
      "Yaradıcı düşüncə tərzin və vizual zövqün dizayn sahəsində parlaq karyera qurmağa şərait yaradır.",
    careers: ["Qrafik dizayner", "UX/UI dizayner", "İnteryer dizayneri", "Animator"],
  },
  {
    id: "psixologiya",
    name: "Psixologiya",
    category: "sosial",
    reason:
      "İnsanları anlamaq və onlara dəstək olmaq istəyin psixologiya peşəsində dərin məna tapacaq.",
    careers: ["Psixoloq", "HR mütəxəssisi", "Məktəb psixoloqu", "Karyera məsləhətçisi"],
  },
];

export function computeResults(answers: number[]): { specialty: Specialty; percent: number }[] {
  const scores: Record<Category, { sum: number; count: number }> = {
    texnologiya: { sum: 0, count: 0 },
    tibbi: { sum: 0, count: 0 },
    humanitar: { sum: 0, count: 0 },
    biznes: { sum: 0, count: 0 },
    yaradiciliq: { sum: 0, count: 0 },
    sosial: { sum: 0, count: 0 },
  };

  QUESTIONS.forEach((q, i) => {
    const a = answers[i] ?? 0;
    scores[q.category].sum += a;
    scores[q.category].count += 1;
  });

  const ranked = SPECIALTIES.map((s) => {
    const { sum, count } = scores[s.category];
    const avg = count > 0 ? sum / count : 0;
    return { specialty: s, score: avg };
  }).sort((a, b) => b.score - a.score);

  const top = ranked.slice(0, 3);
  return top.map((t, i) => ({
    specialty: t.specialty,
    percent: Math.min(97, Math.round(55 + t.score * 9 - i * 7)),
  }));
}
