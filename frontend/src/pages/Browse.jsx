import { useEffect, useState } from "react";
import { getCollections } from "../api/client.js";

const GRADES = ["Sahih", "Hasan", "Da'if", "Mawdu"];

export default function Browse() {
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getCollections()
      .then((d) => setCollections(d.collections))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="page">
      <h1>Browse</h1>

      <section>
        <h2>Browse by Collection</h2>
        {error && <p className="error">{error}</p>}
        <div className="grid">
          {collections.map((c) => (
            <a key={c.key} href={`/collection/${c.key}`} className="collection-card">
              <h2>{c.name}</h2>
              <p className="collection-key">{c.key}</p>
              {c.hasData === false && <span className="badge-offline">Not loaded</span>}
            </a>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Browse by Grade</h2>
        <div className="grid">
          {GRADES.map((g) => (
            <a key={g} href={`/grade/${g}`} className="collection-card">
              <h2>{g}</h2>
              <p className="collection-key">{g === "Da'if" ? "Weak" : g === "Mawdu" ? "Fabricated" : g === "Hasan" ? "Good" : "Authentic"}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
