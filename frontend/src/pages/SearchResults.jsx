import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HadithCard from "../components/HadithCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { searchHadiths } from "../api/client.js";

export default function SearchResults() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const query = params.get("q");
    if (!query) return;
    setQ(query);
    setLoading(true);
    setError("");
    searchHadiths(query)
      .then((d) => setResults(d.results || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params]);

  function onSearch(next) {
    if (next) window.location.href = `/search?q=${encodeURIComponent(next)}`;
  }

  return (
    <div className="page">
      <h1>Search Results</h1>
      <SearchBar onSearch={onSearch} placeholder="Search hadiths..." />
      {q && <p className="muted">Results for "{q}"</p>}
      {loading && <p>Searching...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && results.length === 0 && <p>No results found.</p>}
      <div className="result-list">
        {results.map((h) => (
          <HadithCard key={h.id} hadith={h} />
        ))}
      </div>
    </div>
  );
}
