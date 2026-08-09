import { useState } from "react";
import { ShieldCheck, Info, Loader2 } from "lucide-react";
import HadithCard from "../components/HadithCard.jsx";
import CopyButton from "../components/CopyButton.jsx";

export default function Verify() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setMatches([]);
    setSearched(false);
    try {
      const res = await fetch(`/api/search/verify?text=${encodeURIComponent(text)}&limit=5`);
      const d = await res.json();
      setMatches(d.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }

  return (
    <div className="page">
      <h1>Verify a Hadith Claim</h1>
      <p className="muted">
        Paste a hadith or claim you have heard, and see the closest matching hadiths with their
        established scholarly grades.
      </p>

      <form className="verify-form" onSubmit={onSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Paste the hadith text here..."
          required
        />
        <div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
            <span>{loading ? "Searching..." : "Find Matches"}</span>
          </button>
        </div>
      </form>

      <div className="disclaimer-box">
        <Info size={17} />
        <span>
          This tool performs a data lookup against existing scholarly grades. It does not issue
          religious rulings or verdicts. Please consult qualified scholars for religious decisions.
        </span>
      </div>

      {error && <p className="error">{error}</p>}

      {matches.length > 0 && (
        <>
          <h2>Matching Hadiths ({matches.length})</h2>
          <div className="result-list">
            {matches.map((h) => (
              <HadithCard key={h.id} hadith={h} />
            ))}
          </div>
        </>
      )}
      {!loading && !error && searched && matches.length === 0 && (
        <p>No close matches found.</p>
      )}
    </div>
  );
}
