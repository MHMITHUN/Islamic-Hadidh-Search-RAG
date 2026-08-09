import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
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

  const steps = [
    { icon: Search, title: "Search", desc: "Search 36,000+ hadiths from 10 collections by keyword." },
    { icon: BookOpen, title: "Browse", desc: "Explore collections like Bukhari, Muslim, and Abu Dawud." },
    { icon: ShieldCheck, title: "Verify", desc: "Paste a claim and see matching hadiths with existing grades." },
  ];

  return (
    <div className="home">
      <section className="hero">
        <h1>Search, Browse & Verify Hadiths</h1>
        <p className="hero-sub">
          A free, open-source reference for finding hadiths and checking their scholarly grades.
          No paid APIs. No accounts.
        </p>
        <SearchBar onSearch={onSearch} placeholder="e.g. intention, fasting, prayer..." large />
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
            <span className="stat-number">10</span>
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
          <h2><Sparkles size={18} style={{ verticalAlign: "-3px" }} /> Random Hadith</h2>
          <HadithCard hadith={random} />
        </section>
      )}

      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          {steps.map(({ icon: Icon, title, desc }) => (
            <div className="step" key={title}>
              <h3>
                <span className="step-icon"><Icon size={17} /></span>
                {title}
              </h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
