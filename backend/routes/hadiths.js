import { Router } from "express";
import Hadith from "../models/Hadith.js";
import { getStore } from "../store/memoryStore.js";
import { serializeHadith, serializeMany } from "../store/serialize.js";

const router = Router();

async function findByIdRaw(id) {
  if (process.env.USE_MONGO === "1") {
    const parts = String(id).split("-");
    if (parts.length === 2) {
      return Hadith.findOne({ collection: parts[0], hadith_number: Number(parts[1]) });
    }
    return Hadith.findById(id);
  }
  return getStore().hadiths.find((h) => h.id === id) || null;
}

router.get("/", async (req, res, next) => {
  try {
    const { collection, book, grade, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (collection) filter.collection = collection;
    if (book) filter.book_number = Number(book);
    if (grade) filter.grade = new RegExp(`^${grade}`, "i");

    if (process.env.USE_MONGO === "1") {
      const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
      const [items, total] = await Promise.all([
        Hadith.find(filter).sort({ book_number: 1, hadith_number: 1 }).skip(skip).limit(Number(limit)),
        Hadith.countDocuments(filter),
      ]);
      return res.json({
        items: serializeMany(items),
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      });
    }

    let items = getStore().hadiths;
    if (filter.collection) items = items.filter((h) => h.collection === filter.collection);
    if (filter.book_number) items = items.filter((h) => h.book_number === filter.book_number);
    if (filter.grade) items = items.filter((h) => h.grade && h.grade.toLowerCase().startsWith(grade.toLowerCase()));
    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const total = items.length;
    res.json({ items: items.slice(skip, skip + Number(limit)), total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

router.get("/random", async (req, res, next) => {
  try {
    if (process.env.USE_MONGO === "1") {
      const count = await Hadith.countDocuments();
      const skip = Math.floor(Math.random() * count);
      const [item] = await Hadith.find().skip(skip).limit(1);
      return res.json(serializeHadith(item));
    }
    const { hadiths } = getStore();
    const item = hadiths[Math.floor(Math.random() * hadiths.length)];
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.get("/stats", async (req, res, next) => {
  try {
    if (process.env.USE_MONGO === "1") {
      const [total, grades] = await Promise.all([
        Hadith.countDocuments(),
        Hadith.aggregate([
          { $group: { _id: "$grade", count: { $sum: 1 } } },
          { $sort: { count: -1 } },
        ]),
      ]);
      return res.json({ total, grades: Object.fromEntries(grades.map((g) => [g._id || "None", g.count])) });
    }
    const { hadiths } = getStore();
    const grades = {};
    for (const h of hadiths) {
      const g = h.grade || "None";
      grades[g] = (grades[g] || 0) + 1;
    }
    res.json({ total: hadiths.length, grades });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await findByIdRaw(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(serializeHadith(item));
  } catch (err) {
    next(err);
  }
});

export default router;
