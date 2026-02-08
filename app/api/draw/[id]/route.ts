// app/api/draw/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/app/models/user";
import Project from "@/app/models/project";
import { Draw } from "@/app/models/draw";

const verifyToken = (req: NextRequest): JwtPayload | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
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
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const project = await Project.findById(projectId);
    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isOwner = project.user.equals(user.id);
    const isPermitted = project.permissbleArray?.some(
      (p) => p.user?._id?.toString() === user.id,
    );
    const isPublic = project.appearance === "public";

    if (!isOwner && !isPermitted && !isPublic) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const draw = await Draw.findOne({ projectId });

    return NextResponse.json({
      success: true,
      content: draw?.content || {
        elements: [],
        appState: {
          showWelcomeScreen: false,
          collaborators: [],
        },
        files: {},
      },
    });
  } catch (err) {
    console.error(err);
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
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();

  try {
    const project = await Project.findById(projectId).populate(
      "permissbleArray.user",
      "_id email name",
    );

    if (!project)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isOwner = project.user.equals(user.id);
    const hasWritePermission = project.permissbleArray?.some(
      (p) => p.user?._id.toString() === user.id && p.permission === "write",
    );

    if (!isOwner && !hasWritePermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const draw = await Draw.findOneAndUpdate(
      { projectId },
      { content, ownerId: user.id, updatedAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    return NextResponse.json({
      success: true,
      message: draw ? "Draw updated" : "Draw created",
      draw,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
