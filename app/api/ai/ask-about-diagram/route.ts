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
    (n: { id: string; type: string; data: { label?: string, description: string } }) =>
      `- ${n.id} (${n.type || "default"}): ${n.data?.label || "Unnamed"} ${n.data.description || ""}`,
  )
  .join("\n")}

Edges (${edges.length}):
${edges
  .map(
    (e: { source: string; target: string;  label?: string  }) =>
      `- ${e.source} → ${e.target} (${e.label || "no label"})`,
  )
  .join("\n")}
`;

    const fullPrompt = `
You are an expert system architect analyzing this system design diagram.

${diagramDescription}

User question: ${question}

Answer clearly, concisely, and helpfully. Use bullet points or numbered lists when appropriate.
If the question is about improving/scaling/optimizing the system, provide practical suggestions.
also if nodes and edges are not mentioned and a different question is asked, try to answer based on common system design knowledge.
Do not refer to the diagram if not necessary.
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
