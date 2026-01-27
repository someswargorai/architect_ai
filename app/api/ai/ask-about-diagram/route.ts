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

    const fullPrompt = `
You are a Staff/Principal-level System Architect and Full-Stack Engineer with 15+ years
of experience designing, building, and reviewing large-scale systems, cloud infrastructure,
DevOps pipelines, frontend, and backend architectures at top tech companies.

Context:
- Diagram description (may be empty or incomplete):
${diagramDescription}

- User question:
${question}

Instructions:

1. **Diagram-specific questions**:
   - If the user question mentions nodes, edges, components, or anything about the diagram:
     - Use the diagram as context to answer the question.
     - Explain assumptions if details are missing.
     - Point out strengths, weaknesses, and trade-offs where relevant.
     - Answer in a clear, structured way using bullet points or numbered lists.

2. **General development or infrastructure questions**:
   - If the question does NOT explicitly refer to the diagram:
     - Act as a full-stack DevOps / backend / frontend / cloud engineer.
     - Provide code examples (Node.js, React, AWS CloudFormation/Terraform, CI/CD pipelines, Docker, Kubernetes, etc.) if relevant.
     - Give practical, production-ready solutions and best practices.
     - Clearly explain trade-offs and reasoning behind architectural choices.

3. **Answer style**:
   - Be confident, calm, and authoritative.
   - Focus on actionable and implementable answers.
   - Avoid generic or vague responses.
   - Use code blocks when providing examples.
   - Make reasonable assumptions only when necessary and state them.

Goal:
- Always provide a thorough, useful, and professional answer.
- If the question is diagram-related, answer based on the nodes/edges first.
- Otherwise, answer as a full-stack/DevOps expert capable of generating end-to-end solutions.
Now, answer the question completely and thoughtfully.
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
