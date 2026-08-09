import json
import re
import unicodedata
from pathlib import Path


STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "of", "to", "in", "on",
    "for", "with", "by", "is", "are", "was", "were", "be", "been", "has",
    "have", "had", "will", "would", "shall", "should", "may", "might",
    "must", "that", "this", "these", "those", "it", "he", "she", "they",
    "we", "you", "i", "who", "whom", "which", "not", "no", "so", "do",
    "does", "did",
}


def load_hadiths(path):
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")
    with open(path, "r", encoding="utf-8") as fh:
        return json.load(fh)


def normalize(text):
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    return text


def tokenize(text):
    text = normalize(text)
    tokens = re.findall(r"[a-z']+", text)
    return [t for t in tokens if t not in STOPWORDS and len(t) > 1]
