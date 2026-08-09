import { Schema, model } from "mongoose";

const hadithSchema = new Schema(
  {
    collection: { type: String, required: true, index: true },
    book_number: { type: Number, default: null },
    hadith_number: { type: Number, required: true },
    arabic_text: { type: String, default: "" },
    english_text: { type: String, default: "" },
    bangla_text: { type: String, default: "" },
    narrator: { type: String, default: "" },
    grade: { type: String, default: "" },
    grade_source: { type: String, default: "" },
    reference_url: { type: String, default: "" },
    chapter_title_en: { type: String, default: "" },
    keywords: { type: [String], default: [] },
  },
  { timestamps: true }
);

hadithSchema.index(
  { english_text: "text", arabic_text: "text", keywords: "text" },
  { name: "hadith_text_index" }
);

const Hadith = model("Hadith", hadithSchema);
export default Hadith;
