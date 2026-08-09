import { Router } from "express";
import Hadith from "../models/Hadith.js";
import { getStore } from "../store/memoryStore.js";
import { serializeHadith, serializeMany } from "../store/serialize.js";

const router = Router();

function searchMongo(q, limit = 20) {
  return Hadith.find({ $text: { $search: q } })
    .limit(Number(limit))
    .exec();
}

function searchMemory(q, limit = 20) {
  const { fuse } = getStore();
  if (!fuse) return [];
  return fuse.search(q).slice(0, Number(limit)).map((r) => r.item);
}

router.get("/", async (req, res, next) => {
  try {
    const { q, lang = "en", limit = 20 } = req.query;
    if (!q || !q.trim()) return res.status(400).json({ error: "Missing query param q" });

    let results;
    if (process.env.USE_MONGO === "1") {
      results = serializeMany(await searchMongo(q, limit));
    } else {
      results = searchMemory(q, limit);
    }
    res.json({ query: q, count: results.length, results });
  } catch (err) {
    next(err);
  }
});

router.get("/verify", async (req, res, next) => {
  try {
    const { text, limit = 5 } = req.query;
    if (!text || !text.trim()) return res.status(400).json({ error: "Missing query param text" });

    let matches;
    if (process.env.USE_MONGO === "1") {
      const words = text.trim().split(/\s+/).slice(0, 12).join(" ");
      matches = serializeMany(await searchMongo(words, limit));
    } else {
      matches = searchMemory(text, limit);
    }

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
