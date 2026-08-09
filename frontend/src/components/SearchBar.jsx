import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Search hadiths..." }) {
  const [value, setValue] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    onSearch(value.trim());
  }

  return (
    <form className="searchbar" onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
      />
      <button type="submit">Search</button>
    </form>
  );
}
