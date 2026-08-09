import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import HadithCard from "../components/HadithCard.jsx";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem("sohihfinder-bookmarks") || "[]");
    } catch {
      saved = [];
    }

    if (saved.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }

    Promise.all(
      saved.map((id) =>
        fetch(`/api/hadiths/${id}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      setItems(results.filter(Boolean));
      setLoading(false);
    });
  }, []);

  return (
    <div className="page">
      <h1>Bookmarked Hadiths</h1>
      <p className="muted">Saved locally in your browser.</p>
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && (
        <p>
          <Bookmark size={16} style={{ verticalAlign: "-3px" }} /> No bookmarks yet. Tap the bookmark
          icon on any hadith to save it.
        </p>
      )}
      <div className="result-list">
        {items.map((h) => (
          <HadithCard key={h.id} hadith={h} />
        ))}
      </div>
    </div>
  );
}
