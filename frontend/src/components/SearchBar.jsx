import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function SearchBar({
  onSearch,
  placeholder = "Search hadiths...",
  autoFocus = false,
  large = false,
}) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function onChange(v) {
    setValue(v);
    setOpen(true);
    clearTimeout(timerRef.current);
    if (!v.trim()) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(v)}&limit=6`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }

  function onSubmit(e) {
    e.preventDefault();
    setOpen(false);
    if (value.trim()) onSearch(value.trim());
  }

  function pick(s) {
    setValue("");
    setSuggestions([]);
    setOpen(false);
    onSearch(`${s.collection}-${s.hadith_number}`);
  }

  return (
    <form className={`searchbar${large ? " searchbar-large" : ""}`} onSubmit={onSubmit} ref={boxRef}>
      <div className="searchbar-inner">
        <Search className="searchbar-icon" size={18} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value.trim() && setOpen(true)}
          placeholder={placeholder}
          aria-label="Search"
          autoFocus={autoFocus}
        />
        {loading && <Loader2 className="searchbar-loader spin" size={18} />}
        <button type="submit">Search</button>
      </div>
      {open && value.trim() && (
        <ul className="suggestions">
          {suggestions.length === 0 && !loading && <li className="suggestion-empty">No suggestions</li>}
          {suggestions.map((s) => (
            <li key={s.id} className="suggestion" onClick={() => pick(s)}>
              <span className="suggestion-ref">{s.collection} #{s.hadith_number}</span>
              <span className="suggestion-text">{s.text}</span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
