// app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import jwt from "jsonwebtoken";

// Connect to MongoDB
connectDB();

// Define the shape of your JWT payload
interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

// Helper function to verify token
const verifyToken = (req: NextRequest): JwtPayload | null => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1]; // Expect "Bearer TOKEN"
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload; // cast as JwtPayload
    return decoded;
  } catch (err) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Fetching projects for user:", user);

  try {
    const projects = await Project.find({ user: user.id }).sort({
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

export async function POST(req: NextRequest) {
  const user = verifyToken(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const project = await Project.create({ user: user.id, name:name });

    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
