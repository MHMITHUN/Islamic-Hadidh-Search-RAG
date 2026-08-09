import "dotenv/config";
import mongoose from "mongoose";
import Hadith from "../models/Hadith.js";

const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

const EDITION_NAMES = {
  abudawud: "Sunan Abu Dawud",
  bukhari: "Sahih al Bukhari",
  ibnmajah: "Sunan Ibn Majah",
  malik: "Muwatta Malik",
  muslim: "Sahih Muslim",
  nasai: "Sunan an Nasai",
  tirmidhi: "Jami At Tirmidhi",
};

const LANGUAGE_EDITION = {
  eng: "english_text",
  ara: "arabic_text",
};

function normalizeGrade(raw) {
  if (!raw) return "";
  const text = String(raw).toLowerCase();
  if (text.includes("sahih")) return "Sahih";
  if (text.includes("hasan")) return "Hasan";
  if (text.includes("da'if") || text.includes("daeif") || text.includes("daif")) return "Da'if";
  if (text.includes("mawdu")) return "Mawdu";
  return "Other";
}

function extractNarrator(text) {
  const m = String(text || "").match(/^Narrated\s+([^:]+):/i);
  return m ? m[1].trim() : "";
}

function extractKeywords(text) {
  const stop = new Set([
    "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on",
    "for", "with", "by", "is", "are", "was", "were", "be", "been", "has",
    "have", "had", "will", "would", "shall", "should", "may", "might", "not",
  ]);
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stop.has(w));
  return [...new Set(words)].slice(0, 20);
}

async function fetchEdition(lang, key) {
  const url = `${CDN}/${lang}-${key}.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
}

async function importCollection(key) {
  console.log(`[import] ${key}: fetching eng + ara...`);
  const [eng, ara] = await Promise.all([
    fetchEdition("eng", key),
    fetchEdition("ara", key),
  ]);

  const sections = eng.metadata ? eng.metadata.sections : {};
  const engByNumber = new Map(
    (eng.hadiths || []).map((h) => [h.hadithnumber, h])
  );
  const araByNumber = new Map(
    (ara.hadiths || []).map((h) => [h.hadithnumber, h])
  );

  const numbers = new Set([...engByNumber.keys(), ...araByNumber.keys()]);
  const docs = [];
  for (const num of numbers) {
    const e = engByNumber.get(num);
    const a = araByNumber.get(num);
    const main = e || a;
    const gradeEntry = main.grades && main.grades[0];
    const refBook = main.reference ? main.reference.book : null;
    const refHadith = main.reference ? main.reference.hadith : num;

    docs.push({
      collection: key,
      book_number: refBook,
      hadith_number: num,
      arabic_text: a ? a.text : "",
      english_text: e ? e.text : "",
      bangla_text: "",
      narrator: e ? extractNarrator(e.text) : "",
      grade: normalizeGrade(gradeEntry ? gradeEntry.grade : ""),
      grade_source: gradeEntry ? gradeEntry.name : "",
      reference_url: `https://sunnah.com/${key}/${refBook}:${refHadith}`,
      chapter_title_en: sections ? sections[refBook] || "" : "",
      keywords: e ? extractKeywords(e.text) : [],
    });
  }
  console.log(`[import] ${key}: ${docs.length} docs prepared, upserting...`);
  await Hadith.bulkWrite(
    docs.map((d) => ({
      updateOne: {
        filter: { collection: d.collection, hadith_number: d.hadith_number },
        update: { $set: d },
        upsert: true,
      },
    }))
  );
  console.log(`[import] ${key}: done`);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI env is required to run the import script.");
  process.exit(1);
}

await mongoose.connect(uri);
console.log("[import] connected to MongoDB");

const target = process.argv.slice(2);
const collections = target.length ? target : Object.keys(EDITION_NAMES);
for (const key of collections) {
  try {
    await importCollection(key);
  } catch (err) {
    console.error(`[import] failed for ${key}:`, err.message);
  }
}

await Hadith.createIndexes();
const total = await Hadith.countDocuments();
console.log(`[import] complete. Total hadiths in DB: ${total}`);
await mongoose.disconnect();
