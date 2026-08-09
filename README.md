# Islamic Hadith Search RAG

A Retrieval-Augmented Generation (RAG) based search tool for Islamic Hadiths. This project indexes hadith collections and provides semantic search with LLM-powered answers grounded in retrieved hadiths.

## Features

- Ingests hadith collections (JSON) into an in-memory vector index
- Semantic search over hadith texts using TF-IDF + cosine similarity
- RAG-style answer generation by prompting an LLM with retrieved context
- Minimal dependencies (pure Python for indexing, optional OpenAI-compatible client)

## Project Structure

```
.
├── data/
│   └── hadiths.json          # Sample hadith dataset
├── hadith_search/
│   ├── __init__.py
│   ├── indexer.py            # Vector index building
│   ├── retriever.py          # Semantic search retrieval
│   ├── rag.py                # RAG answer generation
│   └── utils.py              # Shared helpers
├── cli.py                    # Command line interface
├── requirements.txt
└── README.md
```

## Installation

```bash
pip install -r requirements.txt
```

## Usage

### Ingest and search

```bash
python cli.py search --query "intention in actions"
```

### RAG answer generation

```bash
export USER_LLM_API_KEY=your-api-key-here
export USER_LLM_BASE_URL=https://api.openai.com/v1
export USER_LLM_MODEL=gpt-4o-mini

python cli.py ask --query "What is the importance of intention?"
```

## Adding Hadith Data

Drop your hadith JSON files into `data/`. Expected format:

```json
[
  {
    "id": "bukhari-1",
    "collection": "Sahih Bukhari",
    "text": "Actions are judged by intentions...",
    "narrator": "Umar ibn al-Khattab"
  }
]
```

## License

MIT
