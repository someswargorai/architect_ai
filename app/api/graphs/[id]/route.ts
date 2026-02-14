import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import graph from "@/app/models/graph";
import User from "@/app/models/user";
import Project from "@/app/models/project";
import { verifyToken } from "../../middleware/verify-token.middleware";

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
    const me = await User.findById(user.id);
    const project = await Project.findById(projectId)
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const isOwner = project.user.equals(user.id);
    const isPermitted = project.permissbleArray?.some(
      (p) => p.user?._id?.toString() === user.id,
    );

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
    const me = await User.findById(user?.id);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userIsAllowedToChangeTheGraph = await Project.findById(
      projectId,
    ).populate("permissbleArray.user", "_id email name");;

    const canEdit = userIsAllowedToChangeTheGraph?.user?.equals(user.id) 

    const userWithWritePermission = userIsAllowedToChangeTheGraph?.permissbleArray?.some(
      (p) => p.user?._id?.toString() === user.id && p.permission==="write",
    );


    if (!canEdit && !userWithWritePermission) {
      return NextResponse.json(
        { message: "You are not allowed to edit this project", success: false },
        {
          status: 400,
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
