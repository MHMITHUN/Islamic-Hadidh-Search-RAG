import math

from .utils import tokenize


class HadithRetriever:
    """Retrieves the most relevant hadiths for a query."""

    def __init__(self, indexer):
        self.indexer = indexer

    @staticmethod
    def _cosine(a, b):
        if not a or not b:
            return 0.0
        common = set(a) & set(b)
        dot = sum(a[i] * b.get(i, 0) for i in common)
        norm_a = math.sqrt(sum(v * v for v in a.values()))
        norm_b = math.sqrt(sum(v * v for v in b.values()))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)

    def search(self, query, top_k=5):
        query_tokens = tokenize(query)
        query_vec = {}
        for token in query_tokens:
            if token in self.indexer.vocab:
                idx = self.indexer.vocab[token]
                query_vec[idx] = self.indexer.idf[token]

        scored = []
        for i, doc_vec in enumerate(self.indexer.doc_vectors):
            score = self._cosine(query_vec, doc_vec)
            if score > 0:
                scored.append((score, i))

        scored.sort(key=lambda item: item[0], reverse=True)
        results = []
        for score, i in scored[:top_k]:
            doc = self.indexer.documents[i]
            results.append({
                "score": round(score, 4),
                "id": doc.get("id"),
                "collection": doc.get("collection"),
                "narrator": doc.get("narrator"),
                "text": doc.get("text"),
            })
        return results
