import { Router } from "express";
import Hadith from "../models/Hadith.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { collection, book, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (collection) filter.collection = collection;
    if (book) filter.book_number = Number(book);

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Hadith.find(filter).sort({ book_number: 1, hadith_number: 1 }).skip(skip).limit(Number(limit)),
      Hadith.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const item = await Hadith.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

export default router;
