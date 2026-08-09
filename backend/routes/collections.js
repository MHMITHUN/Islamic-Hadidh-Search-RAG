import { Router } from "express";
import Hadith from "../models/Hadith.js";
import { getStore } from "../store/memoryStore.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    if (process.env.USE_MONGO === "1") {
      const collections = await Hadith.distinct("collection");
      return res.json({ collections });
    }
    const { collectionNames } = getStore();
    const list = Object.entries(collectionNames).map(([key, name]) => ({
      key,
      name,
      hasData: getStore().loadedCollections.has(key),
    }));
    res.json({ collections: list });
  } catch (err) {
    next(err);
  }
});

router.get("/:grade", async (req, res, next) => {
  try {
    const grade = req.params.grade;
    const filter = { grade: new RegExp(`^${grade}`, "i") };
    if (process.env.USE_MONGO === "1") {
      const items = await Hadith.find(filter).limit(50);
      return res.json({ grade, count: items.length, items });
    }
    const { hadiths } = getStore();
    const items = hadiths.filter((h) => h.grade && h.grade.toLowerCase().startsWith(grade.toLowerCase())).slice(0, 50);
    res.json({ grade, count: items.length, items });
  } catch (err) {
    next(err);
  }
});

export default router;
