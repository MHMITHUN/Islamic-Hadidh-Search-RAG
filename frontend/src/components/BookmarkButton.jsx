import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const KEY = "sohihfinder-bookmarks";

export function getBookmarks() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function saveBookmarks(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export default function BookmarkButton({ hadith }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = getBookmarks();
    setSaved(list.includes(hadith.id));
  }, [hadith.id]);

  function toggle(e) {
    e.preventDefault();
    e.stopPropagation();
    let list = getBookmarks();
    if (list.includes(hadith.id)) {
      list = list.filter((id) => id !== hadith.id);
    } else {
      list.push(hadith.id);
    }
    saveBookmarks(list);
    setSaved(list.includes(hadith.id));
  }

  return (
    <button
      className={`bookmark-btn${saved ? " saved" : ""}`}
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Bookmark"}
      title={saved ? "Remove bookmark" : "Save hadith"}
    >
      <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
