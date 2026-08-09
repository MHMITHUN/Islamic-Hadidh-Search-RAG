import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    fetch("/api/search?q=intention%20sincerity&limit=1")
      .then((r) => r.json())
      .then((d) => setFeatured(d.results && d.results[0]))
      .catch(() => {});
  }, []);

  function onSearch(q) {
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="home">
      <section className="hero">
        <h1>Search, Browse & Verify Hadiths</h1>
        <p className="hero-sub">
          A free, open-source reference for finding hadiths and checking their scholarly grades.
        </p>
        <SearchBar onSearch={onSearch} placeholder="e.g. intention, fasting, prayer..." />
        <div className="hero-actions">
          <a href="/browse" className="btn btn-outline">Browse Collections</a>
          <a href="/verify" className="btn btn-outline">Verify a Hadith</a>
        </div>
      </section>

      {featured && (
        <section className="featured">
          <h2>Featured Hadith</h2>
          <div className="featured-card">
            <p className="featured-text">{featured.english_text}</p>
            <p className="featured-meta">
              {featured.collection} #{featured.hadith_number}
              {featured.grade ? ` · Grade: ${featured.grade}` : ""}
            </p>
          </div>
        </section>
      )}

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <h3>Search</h3>
            <p>Search 36,000+ hadiths from 7 major collections by keyword.</p>
          </div>
          <div className="step">
            <h3>Browse</h3>
            <p>Explore collections like Bukhari, Muslim, and Abu Dawud.</p>
          </div>
          <div className="step">
            <h3>Verify</h3>
            <p>Paste a claim and see matching hadiths with their existing grades.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
