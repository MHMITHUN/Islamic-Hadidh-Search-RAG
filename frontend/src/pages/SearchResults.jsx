import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import HadithCard from "../components/HadithCard.jsx";
import SearchBar from "../components/SearchBar.jsx";

export default function SearchResults() {
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [grade, setGrade] = useState("");
  const [collection, setCollection] = useState("");
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => setCollections(d.collections || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const query = params.get("q");
    if (!query) return;
    setQ(query);
    setLoading(true);
    setError("");
    const p = new URLSearchParams({ q: query, limit: 30 });
    if (grade) p.set("grade", grade);
    if (collection) p.set("collection", collection);
    fetch(`/api/search?${p.toString()}`)
      .then((r) => r.json())
      .then((d) => setResults(d.results || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params, grade, collection]);

  function onSearch(next) {
    if (next) window.location.href = `/search?q=${encodeURIComponent(next)}`;
  }

  return (
    <div className="page">
      <h1>Search Results</h1>
      <SearchBar onSearch={onSearch} placeholder="Search hadiths..." />

      {q && (
        <div className="filters">
          <p className="muted">Results for "{q}"</p>
          <label>
            Collection
            <select value={collection} onChange={(e) => setCollection(e.target.value)}>
              <option value="">All</option>
              {collections.map((c) => (
                <option key={c.key} value={c.key}>{c.name}</option>
              ))}
            </select>
          </label>
          <label>
            Grade
            <select value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">All</option>
              <option value="Sahih">Sahih</option>
              <option value="Hasan">Hasan</option>
              <option value="Da">Da'if</option>
              <option value="Mawdu">Mawdu</option>
            </select>
          </label>
        </div>
      )}

      {loading && <p>Searching...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <p>
          <Search size={16} style={{ verticalAlign: "-3px" }} /> No results found.
        </p>
      )}
      <div className="result-list">
        {results.map((h) => (
          <HadithCard key={h.id} hadith={h} />
        ))}
      </div>
    </div>
  );
}
