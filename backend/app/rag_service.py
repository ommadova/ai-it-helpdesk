from pathlib import Path

import chromadb
from sentence_transformers import SentenceTransformer


PROJECT_ROOT = Path(__file__).resolve().parents[2]
CHROMA_PATH = PROJECT_ROOT / "rag" / "chroma_db"

embedding_model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)

client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)

collection = client.get_collection(
    name="it_knowledge_base"
)


def retrieve_documents(
    title: str,
    description: str,
    top_k: int = 3,
):
    query = f"{title} {description}"

    query_embedding = embedding_model.encode(
        [query]
    ).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
    )

    retrieved = []

    for document, metadata in zip(
        results["documents"][0],
        results["metadatas"][0],
    ):
        retrieved.append(
            {
                "text": document,
                "source": metadata["source"],
            }
        )

    return retrieved