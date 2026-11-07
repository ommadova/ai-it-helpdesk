
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


PROJECT_ROOT = Path(__file__).resolve().parents[1]
CHROMA_DIR = PROJECT_ROOT / "rag" / "chroma_db"

COLLECTION_NAME = "it_knowledge_base"


model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path=str(CHROMA_DIR))

collection = client.get_collection(
    name=COLLECTION_NAME
)


def search_knowledge_base(query, top_k=3):
    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]

    return [
        {
            "text": document,
            "source": metadata.get("source"),
        }
        for document, metadata in zip(documents, metadatas)
    ]


if __name__ == "__main__":
    query = input("Enter your IT problem: ")

    results = search_knowledge_base(query)

    print("\nTop results:\n")

    for index, result in enumerate(results, start=1):
        print(f"{index}. Source: {result['source']}")
        print(result["text"])
        print("-" * 60)