import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { question, nodes, edges } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.4,
      },
    });

    const diagramDescription = `
Current system diagram:
Nodes (${nodes.length}):
${nodes
  .map(
    (n: {
      id: string;
      type: string;
      data: { label?: string; description: string };
    }) =>
      `- ${n.id} (${n.type || "default"}): ${n.data?.label || "Unnamed"} ${n
        .data.description || ""}`,
  )
  .join("\n")}

Edges (${edges.length}):
${edges
  .map(
    (e: { source: string; target: string; label?: string }) =>
      `- ${e.source} → ${e.target} (${e.label || "no label"})`,
  )
  .join("\n")}
`;

    const fullPrompt = `You are a Staff/Principal-level System Architect with 15+ years of experience
designing and reviewing large-scale distributed systems at companies like Google.

You are analyzing a system design diagram and/or a system design question.

Context:
- Diagram description (may be empty or incomplete):
  ${diagramDescription}

- User question:
  ${question}

Critical rule:
- Always directly answer the user’s question first.
- If the question is definitional or conceptual (e.g., "What is Kafka?"),
  provide a clear, focused explanation before adding any broader system design discussion.
- Do not generalize beyond the scope of the question unless it clearly adds value.

Instructions:
1. If the diagram contains nodes, edges, or architectural components:
   - Use the diagram as context to answer the question.
   - Clearly explain assumptions if any details are missing.
   - Point out strengths, weaknesses, and design trade-offs when relevant.

2. If the diagram is empty, unclear, or does not mention nodes or edges:
   - Do NOT treat the question as undefined.

3. If the user asks conceptual questions (e.g., “What is Kafka?”, “Why use Redis?”, “How does rate limiting work?”):
   - Provide a clear, concise, and technically accurate explanation.
   - Include when and why it is used in real systems.
   - Mention common pitfalls or trade-offs if relevant.

4. If the question is about improving, scaling, reliability, or performance:
   - Give practical, production-ready suggestions.
   - Prefer proven patterns (caching, sharding, async processing, queues, replication, etc.).

5. If details are missing:
   - Make reasonable assumptions instead of refusing to answer.
   - Clearly state assumptions only when necessary.

6. Communication style:
   - Be confident, calm, and authoritative.
   - Answer like a senior system designer mentoring another engineer.
   - Use bullet points or numbered lists where it improves clarity.
   - Avoid unnecessary references to the diagram unless it adds value.

Goal:
Always provide a useful, intelligent, and professional answer—never say the
question is undefined simply because the diagram lacks nodes or edges.
Now, answer the question thoroughly and thoughtfully.
`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text });
  } catch (err) {
    console.error("Ask AI error:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { success: false, error: err.message || "Server error" },
        { status: 500 },
      );
    }
  }
}
