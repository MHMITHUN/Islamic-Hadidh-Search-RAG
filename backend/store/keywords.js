export const SYNONYMS = {
  intention: ["niyyah", "intended", "intent", "intend", "motive", "purpose"],
  prayer: ["salah", "salat", "namaz", "prayed", "worship"],
  fasting: ["sawm", "fast", "ramadan", "ramazan", "rozah"],
  charity: ["zakat", "sadaqah", "donation", "almsgiving", "given"],
  pilgrimage: ["hajj", "umrah", "kaaba", "mecca", "makkah"],
  faith: ["iman", "belief", "believer", "muslim"],
  quran: ["quranic", "qur'an", "koran", "recite", "recitation"],
  prophet: ["messenger", "rasul", "muhammad", "prophets"],
  prayer_time: ["fajr", "dhuhr", "asr", "maghrib", "isha"],
  ablution: ["wudu", "wudhu", "purification", "cleanse", "taharah"],
  marriage: ["nikah", "wedding", "spouse", "wife", "husband"],
  death: ["funeral", "janazah", "grave", "died", "dying", "burial"],
  money: ["wealth", "earnings", "rich", "poverty", "poor", "debt"],
  knowledge: ["learn", "teaching", "scholar", "study", "teacher"],
  honesty: ["truth", "lying", "liar", "falsehood", "truthful"],
};

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on",
  "for", "with", "by", "is", "are", "was", "were", "be", "been", "has",
  "have", "had", "will", "would", "shall", "should", "may", "might", "not",
]);

export function stemWord(w) {
  if (w.length <= 4) return w;
  let s = w;
  for (const suf of ["ingly", "edly", "ing", "ed", "es", "ies", "ly", "s"]) {
    if (s.endsWith(suf) && s.length - suf.length >= 3) {
      s = s.slice(0, -suf.length);
      break;
    }
  }
  return s;
}

export function extractKeywords(text) {
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

  const kws = new Set(words.map(stemWord));

  for (const [concept, syns] of Object.entries(SYNONYMS)) {
    if (syns.some((s) => words.includes(s) || kws.has(stemWord(s)))) {
      kws.add(concept);
      for (const s of syns) kws.add(stemWord(s));
    }
  }

  return [...kws].slice(0, 30);
}
