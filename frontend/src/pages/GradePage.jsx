import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HadithCard from "../components/HadithCard.jsx";

const GRADE_DESC = {
  Sahih: "Authentic",
  Hasan: "Good",
  "Da'if": "Weak",
  Mawdu: "Fabricated",
};

export default function GradePage() {
  const { grade } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch(`/api/collections/${encodeURIComponent(grade)}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [grade]);

  return (
    <div className="page">
      <h1>{grade} Hadiths</h1>
      <p className="muted">{GRADE_DESC[grade] || ""} — showing up to 50 matches.</p>
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}
      <div className="result-list">
        {items.map((h) => (
          <HadithCard key={h.id} hadith={h} />
        ))}
      </div>
      {!loading && items.length === 0 && <p>No hadiths found.</p>}
    </div>
  );
}
