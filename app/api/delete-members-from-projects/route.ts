import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../graphs/[id]/route";
import mongoose from "mongoose";
import activity from "@/app/models/activity";
import User from "@/app/models/user";



export async function POST(
  req: NextRequest,
) {
  try {
    await connectDB();

    const currentUser = verifyToken(req);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, id: projectId } = await req.json();

    if (!projectId || !userId) {
      return NextResponse.json(
        { error: "Missing project ID or user ID" },
        { status: 400 },
      );
    }

    const project = await Project.findById(projectId).populate(
      "permissbleArray.user",
      "email name",
    );
;
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.user.toString() !== currentUser.id) {
      return NextResponse.json(
        { error: "Only the project owner can remove members" },
        { status: 403 },
      );
    }

    

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          permissbleArray: { user: new mongoose.Types.ObjectId(userId) },
        },
      },
      { new: true },
    );

    if(!updatedProject){
      return NextResponse.json(
        { error: "Missing project ID or user ID" },
        { status: 404 },
      );
    }

    const user = await User.findById(userId);

    await activity.create({
      projectId,
      action:"DELETE",
      log: `${user.email} has been removed from this project`,
      email: user.email,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "User removed successfully",
    });
  } catch (err) {
    console.error("DELETE member error:", err);
    return NextResponse.json(
      { error: "Server error", success: false },
      { status: 500 },
    );
  }
}