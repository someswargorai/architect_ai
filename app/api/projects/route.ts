import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Liveblocks } from "@liveblocks/node";

connectDB();

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

const verifyToken = (req: NextRequest): JwtPayload | null => {
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

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  const search = req.nextUrl.searchParams.get("search");

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userObjectId= new mongoose.Types.ObjectId(user.id);
  try {
    const query: {
      $or: (
        | { user: mongoose.Types.ObjectId }
        | { permissbleArray: mongoose.Types.ObjectId }
      )[];
      name?: { $regex: string; $options: string };
    } = { $or: [{ user: userObjectId }, { permissbleArray: userObjectId }] };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }  
    const projects = await Project.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY!
});

export async function POST(req: NextRequest) {
  const user = verifyToken(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description, priority, appearance } = body;

    if (!name && !description) {
      return NextResponse.json(
        { error: "Name and Description is required" },
        { status: 400 },
      );
    }
    const project = await Project.create({
      user: user.id,
      name,
      description,
      priority,
      appearance,
    });

    const projectId = project._id.toString();
    await liveblocks.createRoom(projectId, {
      defaultAccesses: ["room:read", "room:presence:write"],
      usersAccesses: {
        [user.id]: ["room:write"],
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("Error creating project or Liveblocks room:", err);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}