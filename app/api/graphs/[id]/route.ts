import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import graph from "@/app/models/graph";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import Project from "@/app/models/project";

export const verifyToken = (req: NextRequest): JwtPayload | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: projectId } = await params;

  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.user.equals(user.id);
    const isPermitted = project.permissbleArray?.includes(user.id);
    const isPublic = project.appearance === "public";

    const canSee = isOwner || isPermitted || isPublic;

    if (!canSee) {
      return NextResponse.json(
        { error: "You are not allowed to view this project" },
        { status: 403 },
      );
    }

    const projectGraph = await graph
      .findOne({ projectId })
      .select("nodes edges");

    return NextResponse.json({
      success: true,
      nodes: projectGraph?.nodes || [],
      edges: projectGraph?.edges || [],
    });
  } catch (error) {
    console.error("Error loading diagram:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: projectId } = await params;

  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userIsAllowedToChangeTheGraph = await Project.findById(projectId);

  const canEdit =
    userIsAllowedToChangeTheGraph?.user?.equals(user.id) ||
    userIsAllowedToChangeTheGraph?.permissbleArray?.includes(user.id);

  if (!canEdit) {
    return NextResponse.json(
      { message: "You are not allowed to edit this project", success: false },
      {
        status: 200,
      },
    );
  }

  try {
    const { nodes, edges } = await req.json();

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const graphResponse = await graph.findOneAndUpdate(
      { projectId: projectId },
      {
        nodes,
        edges,
        owner: user.id,
        projectId: projectId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      },
    );

    return NextResponse.json({
      success: true,
      message: graphResponse ? "Graph saved successfully" : "Graph created",
      graph: graphResponse,
    });
  } catch (error) {
    console.error("Error saving diagram:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
