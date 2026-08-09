import { useEffect, useState } from "react";
import { getCollections } from "../api/client.js";

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
      <h1>Browse Collections</h1>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {collections.map((c) => (
          <a key={c.key} href={`/search?q=collection:${c.key}`} className="collection-card">
            <h2>{c.name}</h2>
            <p className="collection-key">{c.key}</p>
            {c.hasData === false && <span className="badge-offline">Not loaded</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
