import { Router } from "express";
import { getStore } from "../store/memoryStore.js";
import { scoreHadith, compareHadiths } from "../store/rank.js";

const router = Router();

function searchMemory(q, limit = 20, filters = {}) {
  const { fuse, hadiths } = getStore();
  if (!fuse) return [];

  const fuseHits = fuse.search(q).map((r) => r.item);
  let scored = fuseHits.map((h) => ({ h, ...h, ...scoreHadith(h, q) }));

  const good = scored.filter((s) => s.score > 0);
  const fuzzy = scored.filter((s) => s.score <= 0);
  const sortedGood = good
    .slice()
    .sort((a, b) => compareHadiths(a, b, q))
    .map((s) => s.h);
  const results = [...sortedGood, ...fuzzy.map((s) => s.h)];

  if (filters.collection) results = results.filter((h) => h.collection === filters.collection);
  if (filters.grade) results = results.filter((h) => h.grade && h.grade.toLowerCase().startsWith(filters.grade.toLowerCase()));
  return results.slice(0, Number(limit));
}

router.get("/", async (req, res, next) => {
  try {
    const { q, lang = "en", limit = 20, collection, grade } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ error: "Missing query param q" });

    const results = searchMemory(q, limit, { collection, grade });
    res.json({ query: q, count: results.length, results });
  } catch (err) {
    next(err);
  }
});

router.get("/suggest", async (req, res, next) => {
  try {
    const { q, limit = 8 } = req.query;
    if (!q || !q.trim()) return res.json({ suggestions: [] });
    const results = searchMemory(q, limit);
    const suggestions = results.map((h) => ({
      id: h.id,
      text: h.english_text.slice(0, 120),
      collection: h.collection,
      hadith_number: h.hadith_number,
    }));
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const { text, limit = 5 } = req.query;
    if (!text || !text.trim()) return res.status(400).json({ error: "Missing query param text" });

    const matches = searchMemory(text, limit);
    res.json({
      disclaimer:
        "This is a data lookup against existing scholarly grades only. It does not issue religious rulings.",
      count: matches.length,
      matches,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
