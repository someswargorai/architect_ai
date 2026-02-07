import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "@/app/models/user";
import Project from "@/app/models/project";
import { Note } from "@/app/models/note";


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
  const me = await User.findById(user?.id);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await Project.findById(projectId);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.user.equals(user.id);
    const isPermitted = project.permissbleArray?.some(
      (p) => p.user?._id?.toString() === user.id,
    );
    const isPublic = project.appearance === "public";

    if (!isOwner && !isPermitted && !isPublic) {
      return NextResponse.json(
        { error: "You are not allowed to view this note" },
        { status: 403 },
      );
    }

    const note = await Note.findOne({ projectId }).select("content");

    return NextResponse.json({
      success: true,
      content: note?.content || [],
    });
  } catch (error) {
    console.error("Error loading note:", error);
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

  console.log("id",projectId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await Project.findById(projectId).populate(
      "permissbleArray.user",
      "_id email name",
    );

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.user.equals(user.id);
    const hasWritePermission = project.permissbleArray?.some(
      (p) => p.user?._id?.toString() === user.id && p.permission === "write",
    );

    if (!isOwner && !hasWritePermission) {
      return NextResponse.json(
        { success: false, message: "You are not allowed to edit this note" },
        { status: 403 },
      );
    }

    const { content } = await req.json();

    
    const note = await Note.findOneAndUpdate(
      { projectId },
      {
        content,
        owner: user.id,
        projectId,
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
      message: note ? "Note saved successfully" : "Note created",
      note,
    });
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
