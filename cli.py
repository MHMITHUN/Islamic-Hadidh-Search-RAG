import argparse
import json
import sys

from hadith_search import HadithIndexer, HadithRAG, HadithRetriever
from hadith_search.utils import load_hadiths


DEFAULT_DATA = "data/hadiths.json"


def build_pipeline(data_path):
    documents = load_hadiths(data_path)
    indexer = HadithIndexer(documents)
    return indexer


def cmd_search(args):
    indexer = build_pipeline(args.data)
    retriever = HadithRetriever(indexer)
    results = retriever.search(args.query, top_k=args.top_k)
    if not results:
        print("No matches found.")
        return 0
    for r in results:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    return 0


def cmd_ask(args):
    indexer = build_pipeline(args.data)
    rag = HadithRAG(indexer, top_k=args.top_k)
    try:
        output = rag.ask(args.query)
    except RuntimeError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    print(f"Answer: {output['answer']}\n")
    print("Retrieved hadiths:")
    for r in output["results"]:
        print(f"- [{r.get('id')}] {r['text']}")
    return 0


def main():
    parser = argparse.ArgumentParser(
        description="Islamic Hadith Search RAG tool"
    )
    parser.add_argument("--data", default=DEFAULT_DATA, help="Path to hadith JSON")

    sub = parser.add_subparsers(dest="command", required=True)

    search_p = sub.add_parser("search", help="Semantic search over hadiths")
    search_p.add_argument("--query", required=True, help="Search query")
    search_p.add_argument("--top-k", type=int, default=5)
    search_p.set_defaults(func=cmd_search)

    ask_p = sub.add_parser("ask", help="Ask a question with RAG answers")
    ask_p.add_argument("--query", required=True, help="Question to ask")
    ask_p.add_argument("--top-k", type=int, default=3)
    ask_p.set_defaults(func=cmd_ask)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
