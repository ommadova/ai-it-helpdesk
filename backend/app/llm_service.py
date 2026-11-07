import ollama


MODEL_NAME = "llama3.2"


def generate_solution(
    title,
    description,
    category,
    priority,
    documents
):
    if not documents:
        return {
            "recommendation": (
                "No relevant knowledge-base information was found. "
                "Additional investigation is required."
            ),
            "sources": [],
        }

    context_parts = []

    for index, document in enumerate(documents, start=1):
        source = document.get("source", "Unknown source")
        text = document.get("text", "")

        context_parts.append(
            f"""
SOURCE {index}
File: {source}

{text}
"""
        )

    context = "\n".join(context_parts)

    prompt = f"""
You are an IT helpdesk support assistant.

Generate a troubleshooting recommendation for the support ticket below.

Rules:
- Base the recommendation primarily on the supplied knowledge-base context.
- Do not invent company policies, credentials, systems, or procedures.
- If the context is insufficient, clearly say additional investigation is needed.
- Give clear numbered troubleshooting steps.
- Mention escalation when appropriate.
- Keep the response concise and practical.

Ticket Title:
{title}

Ticket Description:
{description}

Predicted Category:
{category}

Predicted Priority:
{priority}

Knowledge Base Context:
{context}

Generate the recommended troubleshooting solution.
"""

    response = ollama.chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    recommendation = response["message"]["content"]

    sources = list(
        dict.fromkeys(
            document["source"]
            for document in documents
            if document.get("source")
        )
    )

    return {
        "recommendation": recommendation,
        "sources": sources,
    }