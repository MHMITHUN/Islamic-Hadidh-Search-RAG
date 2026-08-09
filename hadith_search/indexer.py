import math
from collections import Counter

from .utils import tokenize


class HadithIndexer:
    """Builds a TF-IDF vector index over hadith documents."""

    def __init__(self, documents):
        self.documents = documents
        self.vocab = {}
        self.df = Counter()
        self._build()

    def _build(self):
        self.doc_tokens = [tokenize(doc.get("text", "")) for doc in self.documents]

        for tokens in self.doc_tokens:
            for token in set(tokens):
                if token not in self.vocab:
                    self.vocab[token] = len(self.vocab)
                self.df[token] += 1

        n_docs = len(self.documents)
        self.idf = {
            token: math.log((1 + n_docs) / (1 + count)) + 1.0
            for token, count in self.df.items()
        }
        self.doc_vectors = [
            self._tfidf_vector(tokens)
            for tokens in self.doc_tokens
        ]

    def _tfidf_vector(self, tokens):
        tf = Counter(tokens)
        vector = {}
        for token, count in tf.items():
            if token in self.vocab:
                vector[self.vocab[token]] = (1 + math.log(count)) * self.idf[token]
        return vector
