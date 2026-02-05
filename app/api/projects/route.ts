import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Liveblocks } from "@liveblocks/node";
import { getIP } from "@/app/lib/get-ip";
import { rateLimiter, redis } from "@/app/lib/rateLimit";
import { rateLimtingFn } from "@/app/lib/rateLimitingFn";
import { getCache, setCache } from "@/app/lib/cache";

connectDB();

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

interface Form {
  priority: "medium" | "high" | "low" | undefined;
  startDate: Date | undefined;
  appearance: "public" | "private" | undefined;
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

  const rateLimit = await rateLimtingFn();
  if(rateLimit) return rateLimit;
  
  const user = verifyToken(req);
  const search = req.nextUrl.searchParams.get("search");
  const formParam = req.nextUrl.searchParams.get("form");
  
  let form: Partial<Form> = {};
  const key = `projects-get:${user?.id}:${search ?? "all"}:${JSON.stringify(form)}`;
  const cached = await getCache(key);
  
  if (formParam) {
    const parsed = JSON.parse(formParam);

    form = {
      priority: parsed.priority,
      appearance: parsed.appearance,
      startDate: parsed.startDate ? new Date(parsed.startDate) : undefined,
    };
  }

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userObjectId = new mongoose.Types.ObjectId(user.id);
  try {
    const query: {
      $or: (
        | { user: mongoose.Types.ObjectId }
        | { "permissbleArray.user": mongoose.Types.ObjectId }
      )[];
      name?: { $regex: string; $options: string };
      appearance?: "public" | "private" | undefined;
      priority?: "high" | "medium" | "low" | undefined;
      createdAt?: {
        $gte?: Date;
      };
    } = {
      $or: [{ user: userObjectId }, { "permissbleArray.user": userObjectId }],
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (form.appearance) {
      query.appearance = form.appearance;
    }

    if (form.priority) {
      query.priority = form.priority;
    }

    if(form.startDate){
      const start = new Date(form.startDate);
      query.createdAt = {
        $gte: start,
      };
    }

    if(cached){
      return NextResponse.json(cached, { status: 200 });
    }
    const projects = await Project.find(query).sort({
      createdAt: -1,
    });

    await setCache(key, projects);
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
  secret: process.env.LIVEBLOCK_SECRET_KEY!,
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

    await redis.del(`projects-get:${user?.id}`);
    return NextResponse.json(project, { status: 201 });
  } catch (err) {
    console.error("Error creating project or Liveblocks room:", err);

    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
