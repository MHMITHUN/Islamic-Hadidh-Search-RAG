import Fuse from "fuse.js";
import { extractKeywords } from "./keywords.js";

const CDN = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

const EDITION_NAMES = {
  abudawud: "Sunan Abu Dawud",
  bukhari: "Sahih al Bukhari",
  dehlawi: "Forty Hadith of Shah Waliullah Dehlawi",
  ibnmajah: "Sunan Ibn Majah",
  malik: "Muwatta Malik",
  muslim: "Sahih Muslim",
  nasai: "Sunan an Nasai",
  nawawi: "Forty Hadith of an-Nawawi",
  qudsi: "Forty Hadith Qudsi",
  tirmidhi: "Jami At Tirmidhi",
};

let hadiths = [];
let fuse = null;
let loadedCollections = new Set();

function normalizeGrade(raw) {
  if (!raw) return "";
  const text = String(raw).toLowerCase();
  if (text.includes("sahih")) return "Sahih";
  if (text.includes("hasan")) return "Hasan";
  if (text.includes("da'if") || text.includes("daeif") || text.includes("daif")) return "Da'if";
  if (text.includes("mawdu") || text.includes("mawdu")) return "Mawdu";
  return "Other";
}

function buildFuse() {
  fuse = new Fuse(hadiths, {
    keys: [
      { name: "keywords", weight: 0.45 },
      { name: "english_text", weight: 0.4 },
      { name: "narrator", weight: 0.1 },
      { name: "id", weight: 0.05 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 3,
  });
}

export async function loadCollections(collections = Object.keys(EDITION_NAMES)) {
  for (const key of collections) {
    if (loadedCollections.has(key)) continue;
    try {
      const engRes = await fetch(`${CDN}/eng-${key}.json`);
      if (!engRes.ok) {
        console.warn(`[store] skip ${key}: eng HTTP ${engRes.status}`);
        continue;
      }
      const engData = await engRes.json();

      let araItems = [];
      try {
        const araRes = await fetch(`${CDN}/ara-${key}.json`);
        if (araRes.ok) {
          const araData = await araRes.json();
          araItems = araData.hadiths || [];
        }
      } catch {
        /* arabic edition not available */
      }

      const { sections } = engData.metadata || {};
      const engItems = engData.hadiths || [];
      const araByNumber = new Map(araItems.map((h) => [h.hadithnumber, h.text]));

      for (const h of engItems) {
        const gradeEntry = h.grades && h.grades[0];
        const refBook = h.reference ? h.reference.book : null;
        const refHadith = h.reference ? h.reference.hadith : h.hadithnumber;
        hadiths.push({
          id: `${key}-${h.hadithnumber}`,
          collection: key,
          book_number: refBook,
          hadith_number: h.hadithnumber,
          arabic_text: araByNumber.get(h.hadithnumber) || "",
          english_text: h.text || "",
          bangla_text: "",
          narrator: extractNarrator(h.text),
          grade: normalizeGrade(gradeEntry ? gradeEntry.grade : ""),
          grade_source: gradeEntry ? gradeEntry.name : "",
          reference_url: `https://sunnah.com/${key}/${refBook}:${refHadith}`,
          chapter_title_en: sections ? sections[refBook] || "" : "",
          keywords: extractKeywords(h.text),
        });
      }
      loadedCollections.add(key);
      console.log(`[store] loaded ${key}: ${engItems.length} hadiths`);
    } catch (err) {
      console.error(`[store] failed to load ${key}:`, err.message);
    }
  }
  buildFuse();
  return hadiths.length;
}

function extractNarrator(text) {
  const m = String(text || "").match(/^Narrated\s+([^:]+):/i);
  return m ? m[1].trim() : "";
}

export function getStore() {
  return {
    hadiths,
    fuse,
    loadedCollections,
    collectionNames: EDITION_NAMES,
  };
}

export function resetStore() {
  hadiths = [];
  fuse = null;
  loadedCollections.clear();
}
