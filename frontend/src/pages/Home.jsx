import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar.jsx";
import HadithCard from "../components/HadithCard.jsx";

export default function Home() {
  const navigate = useNavigate();
  const [random, setRandom] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/hadiths/random")
      .then((r) => r.json())
      .then(setRandom)
      .catch(() => {});
    fetch("/api/hadiths/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  function onSearch(q) {
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  const gradeOrder = ["Sahih", "Hasan", "Da'if", "Mawdu", "Other", "None"];

  return (
    <div className="home">
      <section className="hero">
        <h1>Search, Browse & Verify Hadiths</h1>
        <p className="hero-sub">
          A free, open-source reference for finding hadiths and checking their scholarly grades.
          No paid APIs. No accounts.
        </p>
        <SearchBar onSearch={onSearch} placeholder="e.g. intention, fasting, prayer..." />
        <div className="hero-actions">
          <a href="/browse" className="btn btn-outline">Browse Collections</a>
          <a href="/verify" className="btn btn-outline">Verify a Hadith</a>
        </div>
      </section>

      {stats && (
        <section className="stats">
          <div className="stat-block">
            <span className="stat-number">{stats.total.toLocaleString()}</span>
            <span className="stat-label">Hadiths Indexed</span>
          </div>
          <div className="stat-block">
            <span className="stat-number">7</span>
            <span className="stat-label">Collections</span>
          </div>
          <div className="grade-summary">
            {gradeOrder
              .filter((g) => stats.grades[g] > 0)
              .map((g) => (
                <span key={g} className="grade-chip">
                  {g}: {stats.grades[g].toLocaleString()}
                </span>
              ))}
          </div>
        </section>
      )}

      {random && (
        <section className="featured">
          <h2>Random Hadith</h2>
          <HadithCard hadith={random} />
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
