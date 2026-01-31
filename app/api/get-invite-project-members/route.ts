import Project from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get("id");

    const project = await Project.findById(projectId)
      .populate({
        path: "permissbleArray",
        select: "_id email",
      })
      
    return NextResponse.json(
      { users: project.permissbleArray, success: true },
      { status: 200 },
    );

  } catch (err) {
    return NextResponse.json({ err: err, success: false }, { status: 400 });
  }
}
