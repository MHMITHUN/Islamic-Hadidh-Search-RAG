import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { gradeBadgeClass } from "../components/grade.js";

export default function HadithDetail() {
  const { id } = useParams();
  const [h, setH] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/hadiths/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setH)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page"><p>Loading...</p></div>;
  if (error) return <div className="page"><p className="error">{error}</p></div>;
  if (!h) return <div className="page"><p className="error">Hadith not found.</p></div>;

  return (
    <div className="page">
      <div className="detail-card">
        <div className="detail-header">
          <span className="hadith-ref">
            {h.collection} #{h.hadith_number}
            {h.book_number ? ` · Book ${h.book_number}` : ""}
          </span>
          <span className={gradeBadgeClass(h.grade)}>{h.grade || "Unverified"}</span>
        </div>
        {h.chapter_title_en && <p className="detail-chapter">{h.chapter_title_en}</p>}
        {h.arabic_text && <p className="arabic-text">{h.arabic_text}</p>}
        <p className="detail-text">{h.english_text}</p>
        {h.narrator && <p className="detail-narrator">Narrated: {h.narrator}</p>}
        {h.grade_source && <p className="muted">Grade source: {h.grade_source}</p>}
        <div className="detail-links">
          <a href={h.reference_url} target="_blank" rel="noopener noreferrer" className="btn btn-link">
            View on Sunnah.com
          </a>
        </div>
      </div>
    </div>
  );
}
