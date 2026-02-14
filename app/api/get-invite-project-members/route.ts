import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";

connectDB();

import User from "@/app/models/user";
import Project from "@/app/models/project";
import { verifyToken } from "../middleware/verify-token.middleware";

export async function GET(req: NextRequest) {
  try {

    const user = verifyToken(req);
    const me = User.find(user?.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const projectId = req.nextUrl.searchParams.get("id");

    const project = await Project.findById(projectId).populate({
      path: "permissbleArray.user",
      select: "_id email",
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found", success: false },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { users: project.permissbleArray, success: true },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err: err, success: false }, { status: 400 });
  }
}
