import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(
      "AIzaSyC_IHFSLriFjIDLA2cZuwRiBDFC6DmGgvg",
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const fullPrompt = `
        You are a Staff Software Engineer (L8/L9) at Google with 15+ years of experience designing large-scale, highly available, fault-tolerant distributed systems used by billions of users.

        Your task is to generate a **professional, production-grade system design diagram** for the following requirement:

        "${prompt}"

        Rules - STRICTLY FOLLOW THESE:
        - Return **ONLY valid JSON** — no explanations, no markdown, no code fences, no comments, nothing else.
        - Use **modern, battle-tested architectural patterns** (microservices, event-driven, CQRS, caching, sharding, CDNs, observability, security boundaries, etc.).
        - Think like a Google SDE-11: prioritize **scalability, reliability, observability, cost-efficiency, security, and operational simplicity**.
        - Include **all critical components** (load balancers, API gateways, services, databases, caches, queues, storage, monitoring, auth, rate limiting, etc.).
        - Use **clear, concise, professional node labels** — real-world names (e.g., "API Gateway", "User Service", "Cassandra Cluster", "Pub/Sub", "Redis (Cache + Session)", "Cloud CDN", "Prometheus + Grafana", etc.).
        - Every node must have:
        - "id": unique short string (e.g., "api-gw", "user-svc", "redis-cache")
        - "label": professional name (e.g., "API Gateway (GFE)", "Auth Service (OAuth2 + JWT)")
        - "description": **one clear sentence** explaining exactly what this component does and why it exists
        - "type": one of "input" | "default" | "output" | "database" | "cache" | "queue" | "external"
        - Edges must have meaningful "label" describing the interaction (e.g., "gRPC / REST", "Pub/Sub Topic", "Read Replica", "Async Event", "JWT Validation", etc.).

        Schema (must follow exactly):
        {
        "nodes": [
            {
            "id": "string",
            "label": "string",
            "description": "string",
            "type": "input | default | output | database | cache | queue | external"
            }
        ],
        "edges": [
            {
            "id": "string",
            "source": "string",
            "target": "string",
            "label": "string (e.g., 'HTTP/2', 'gRPC', 'Pub/Sub', 'Read', 'Write', 'Sync', 'Async')"
            }
        ]
        }

        Think step-by-step before generating:
        1. Understand the core requirements and user flows.
        2. Identify key components and their responsibilities.
        3. Choose appropriate technologies/patterns (assume cloud-native: GCP/AWS/Azure).
        4. Ensure high availability, horizontal scalability, low latency, and fault tolerance.
        5. Consider security (auth, rate limiting, WAF), observability (logging, metrics, tracing), and data consistency.
        6. Design for peak load and graceful degradation.

        Now generate the system design.
        `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, text });
  } catch (err) {
    console.error("Gemini API error:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { success: false, error: err.message || "Server error" },
        { status: 500 },
      );
    }
  }
}
