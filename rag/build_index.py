
from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


PROJECT_ROOT = Path(__file__).resolve().parents[1]
KNOWLEDGE_BASE_DIR = PROJECT_ROOT / "knowledge_base"
CHROMA_DIR = PROJECT_ROOT / "rag" / "chroma_db"

COLLECTION_NAME = "it_knowledge_base"


def load_documents():
    documents = []

    for file_path in KNOWLEDGE_BASE_DIR.glob("*.md"):
        text = file_path.read_text(encoding="utf-8")

        # Simple chunking
        chunks = [
            text[i:i + 500]
            for i in range(0, len(text), 500)
            if text[i:i + 500].strip()
        ]

        for index, chunk in enumerate(chunks):
            documents.append(
                {
                    "id": f"{file_path.stem}-{index}",
                    "text": chunk,
                    "source": file_path.name,
                }
            )

    return documents


def build_index():
    documents = load_documents()

    if not documents:
        print("No knowledge base documents found.")
        return

    model = SentenceTransformer("all-MiniLM-L6-v2")

    texts = [doc["text"] for doc in documents]
    embeddings = model.encode(texts).tolist()

    client = chromadb.PersistentClient(path=str(CHROMA_DIR))

    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception:
        pass

    collection = client.create_collection(name=COLLECTION_NAME)

    collection.add(
        ids=[doc["id"] for doc in documents],
        documents=texts,
        embeddings=embeddings,
        metadatas=[
            {"source": doc["source"]}
            for doc in documents
        ],
    )

    print(f"Stored {len(documents)} chunks in Chroma.")
    print(f"Database location: {CHROMA_DIR}")


if __name__ == "__main__":
    build_index()