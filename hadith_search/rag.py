import os

from .retriever import HadithRetriever


SYSTEM_PROMPT = (
    "You are a knowledgeable assistant about Islamic hadiths. "
    "Answer the user's question using ONLY the provided hadith context. "
    "If the context does not contain enough information, say so clearly. "
    "Always cite the collection and narrator when available."
)


class HadithRAG:
    """Generates grounded answers using retrieved hadiths as context."""

    def __init__(self, indexer, retriever=None, top_k=3):
        self.indexer = indexer
        self.retriever = retriever or HadithRetriever(indexer)
        self.top_k = top_k

    def _format_context(self, results):
        parts = []
        for r in results:
            meta = r.get("collection") or "Unknown"
            if r.get("narrator"):
                meta += f" - narrated by {r['narrator']}"
            parts.append(f"[{r.get('id')} | {meta}]\n{r['text']}")
        return "\n\n".join(parts)

    def _call_llm(self, query, context):
        api_key = os.getenv("USER_LLM_API_KEY")
        base_url = os.getenv("USER_LLM_BASE_URL", "https://api.openai.com/v1")
        model = os.getenv("USER_LLM_MODEL", "gpt-4o-mini")

        if not api_key:
            raise RuntimeError(
                "USER_LLM_API_KEY is not set. Provide it via environment to generate answers."
            )

        import requests

        prompt = (
            f"{SYSTEM_PROMPT}\n\n"
            f"Context:\n{context}\n\n"
            f"Question: {query}\n\n"
            f"Answer:"
        )
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
        }
        resp = requests.post(
            f"{base_url}/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()

    def ask(self, query):
        results = self.retriever.search(query, top_k=self.top_k)
        if not results:
            return {
                "answer": "No relevant hadiths found for this query.",
                "results": [],
            }
        context = self._format_context(results)
        answer = self._call_llm(query, context)
        return {"answer": answer, "results": results}
