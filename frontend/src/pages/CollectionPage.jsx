import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HadithCard from "../components/HadithCard.jsx";

export default function CollectionPage() {
  const { name } = useParams();
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [book, setBook] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page, limit: 20 });
    if (book) params.set("book", book);
    fetch(`/api/hadiths?collection=${name}&${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setPages(d.pages || 1);
        setTotal(d.total || 0);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [name, page, book]);

  return (
    <div className="page">
      <h1>{name}</h1>
      <p className="muted">{total} hadiths found</p>

      <div className="filters">
        <label>
          Book #
          <input
            type="number"
            min="1"
            value={book}
            placeholder="All books"
            onChange={(e) => {
              setBook(e.target.value);
              setPage(1);
            }}
          />
        </label>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="result-list">
        {items.map((h) => (
          <HadithCard key={h.id} hadith={h} />
        ))}
      </div>

      {!loading && items.length === 0 && <p>No hadiths found.</p>}

      {pages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} / {pages}
          </span>
          <button disabled={page >= pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
