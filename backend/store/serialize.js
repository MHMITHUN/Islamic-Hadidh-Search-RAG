export function serializeHadith(doc) {
  return {
    id: `${doc.collection}-${doc.hadith_number}`,
    collection: doc.collection,
    book_number: doc.book_number,
    hadith_number: doc.hadith_number,
    arabic_text: doc.arabic_text || "",
    english_text: doc.english_text || "",
    bangla_text: doc.bangla_text || "",
    narrator: doc.narrator || "",
    grade: doc.grade || "",
    grade_source: doc.grade_source || "",
    reference_url: doc.reference_url || "",
    chapter_title_en: doc.chapter_title_en || "",
    keywords: doc.keywords || [],
  };
}

export function serializeMany(docs) {
  return docs.map(serializeHadith);
}
