import { Link } from "react-router-dom";
import { gradeBadgeClass } from "./grade.js";

export default function HadithCard({ hadith }) {
  return (
    <Link to={`/hadith/${hadith.id}`} className="hadith-card">
      <div className="hadith-card-top">
        <span className="hadith-ref">
          {hadith.collection} #{hadith.hadith_number}
        </span>
        <span className={gradeBadgeClass(hadith.grade)}>{hadith.grade || "Unverified"}</span>
      </div>
      <p className="hadith-text">{hadith.english_text}</p>
      {hadith.narrator && <p className="hadith-narrator">Narrated: {hadith.narrator}</p>}
    </Link>
  );
}
