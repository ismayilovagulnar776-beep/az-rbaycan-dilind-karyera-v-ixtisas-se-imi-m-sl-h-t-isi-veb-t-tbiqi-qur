export interface PracticeQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctIndex: number;
  context: string;
}

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: "riyaziyyat-1",
    subject: "Riyaziyyat",
    text: "2x + 6 = 14 tənliyində x neçəyə bərabərdir?",
    options: ["3", "4", "7", "10"],
    correctIndex: 1,
    context: "Birməchullu xətti tənliklər: hər iki tərəfdən eyni ədədi çıxmaq və bölmək.",
  },
  {
    id: "riyaziyyat-2",
    subject: "Riyaziyyat",
    text: "Bir malın qiyməti 80 manatdır. 25% endirimdən sonra qiyməti nə qədər olar?",
    options: ["55 manat", "60 manat", "65 manat", "20 manat"],
    correctIndex: 1,
    context: "Faizlər: ədədin faizini tapmaq və endirimli qiyməti hesablamaq.",
  },
  {
    id: "fizika-1",
    subject: "Fizika",
    text: "Avtomobil 3 saatda 180 km yol qət edib. Onun orta sürəti nə qədərdir?",
    options: ["540 km/saat", "90 km/saat", "60 km/saat", "45 km/saat"],
    correctIndex: 2,
    context: "Mexanika: sürət = yol / zaman düsturu.",
  },
  {
    id: "dil-1",
    subject: "Azərbaycan dili",
    text: "Hansı sözdə şəkilçi düzgün yazılmışdır?",
    options: ["kitabdar", "məktəbli", "gözəldik", "yazıcılıq-lar"],
    correctIndex: 1,
    context: "Morfologiya: sözdüzəldici şəkilçilər və onların yazılışı.",
  },
  {
    id: "biologiya-1",
    subject: "Biologiya",
    text: "Bitkilərdə fotosintez prosesi hüceyrənin hansı orqanoidində baş verir?",
    options: ["Mitoxondri", "Nüvə", "Xloroplast", "Ribosom"],
    correctIndex: 2,
    context: "Hüceyrə biologiyası: orqanoidlərin funksiyaları.",
  },
  {
    id: "kimya-1",
    subject: "Kimya",
    text: "Suyun kimyəvi formulu hansıdır?",
    options: ["CO₂", "H₂O", "O₂", "NaCl"],
    correctIndex: 1,
    context: "Qeyri-üzvi kimya: sadə birləşmələrin formulları.",
  },
];

export function getPracticeQuestion(id: string) {
  return PRACTICE_QUESTIONS.find((q) => q.id === id);
}
