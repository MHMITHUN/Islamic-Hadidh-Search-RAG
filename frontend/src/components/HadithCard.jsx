import { Link } from "react-router-dom";
import { gradeBadgeClass } from "./grade.js";
import BookmarkButton from "./BookmarkButton.jsx";
import CopyButton from "./CopyButton.jsx";

export default function HadithCard({ hadith }) {
  return (
    <Link to={`/hadith/${hadith.id}`} className="hadith-card">
      <div className="hadith-card-top">
        <span className="hadith-ref">
          {hadith.collection} #{hadith.hadith_number}
        </span>
        <div className="card-actions">
          <BookmarkButton hadith={hadith} />
          <span className={gradeBadgeClass(hadith.grade)}>{hadith.grade || "Unverified"}</span>
        </div>
      </div>
      <p className="hadith-text">{hadith.english_text}</p>
      {hadith.narrator && <p className="hadith-narrator">Narrated: {hadith.narrator}</p>}
    </Link>
  );
}
