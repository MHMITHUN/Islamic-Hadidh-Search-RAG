import { useState } from "react";
import HadithCard from "../components/HadithCard.jsx";
import { verifyText } from "../api/client.js";

export default function Verify() {
  const [text, setText] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const d = await verifyText(text);
      setMatches(d.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Searching..." : "Find Matches"}
        </button>
      </form>

      <div className="disclaimer-box">
        This tool performs a data lookup against existing scholarly grades. It does not issue
        religious rulings or verdicts. Please consult qualified scholars for religious decisions.
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
      {!loading && !error && matches.length === 0 && text && (
        <p>No close matches found.</p>
      )}
    </div>
  );
}
