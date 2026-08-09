import { stemWord } from "./keywords.js";

const STOP = new Set([
  "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on",
  "for", "with", "by", "is", "are", "was", "were", "be", "been", "has",
  "have", "had", "will", "would", "shall", "should", "may", "might", "not",
  "narrated", "said", "saying", "prophet", "allah", "messenger",
]);

function tokens(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w))
    .map(stemWord);
}

function rawWords(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
}

export function scoreHadith(h, query) {
  const qTokens = tokens(query);
  if (qTokens.length === 0) return { score: 0 };

  const textStems = new Set(tokens(h.english_text));
  const textRaw = new Set(rawWords(h.english_text));
  const kwSet = new Set((h.keywords || []).map(stemWord));
  const kwRaw = new Set((h.keywords || []));
  const narratorTokens = new Set(tokens(h.narrator));
  const metaTokens = new Set(tokens(`${h.collection} ${h.chapter_title_en}`));

  let total = 0;
  let hits = 0;

  for (const qt of qTokens) {
    let best = 0;
    if (kwSet.has(qt)) best = Math.max(best, 1.0);
    if (textStems.has(qt)) best = Math.max(best, 0.9);
    if (narratorTokens.has(qt)) best = Math.max(best, 0.6);
    if (metaTokens.has(qt)) best = Math.max(best, 0.5);
    if (best > 0) {
      hits += 1;
      total += best;
    }
  }

  const coverage = hits / qTokens.length;
  if (coverage < 0.5) return { score: 0 };

  let base = (total / hits) * coverage;

  const qRaw = rawWords(query);
  let exactInText = 0;
  for (const w of qRaw) {
    if (textRaw.has(w) || kwRaw.has(w)) exactInText += 1;
  }
  base += (exactInText / qRaw.length) * 0.2;

  return { score: base, hits, coverage, exactInText };
}

export function compareHadiths(a, b, query) {
  if (b.score !== a.score) return b.score - a.score;
  if (b.exactInText !== a.exactInText) return b.exactInText - a.exactInText;
  if (b.hits !== a.hits) return b.hits - a.hits;
  const ab = Number(a.hadith_number) || 0;
  const bb = Number(b.hadith_number) || 0;
  return ab - bb;
}

export function compareScored(a, b, query) {
  return compareHadiths(a, b, query);
}
