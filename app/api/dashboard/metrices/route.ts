import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import Graph from "@/app/models/graph";
import { verifyToken } from "../../graphs/[id]/route";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user.id);

    /* -------------------- 1. TOTAL GRAPHS -------------------- */
    const totalGraphs = await Graph.countDocuments({ owner: userId });

    /* -------------------- 2. TOTAL COLLABORATORS -------------------- */
    const collaboratorsAgg = await Project.aggregate([
      { $match: { user: userId } },
      { $unwind: "$permissbleArray" },
      {
        $group: {
          _id: "$permissbleArray.user",
        },
      },
      {
        $count: "totalCollaborators",
      },
    ]);

    const highPriority = await Project.find({ priority: "high", user: userId });

    const totalCollaborators =
      collaboratorsAgg.length > 0 ? collaboratorsAgg[0].totalCollaborators : 0;

    /* -------------------- 4. PROJECTS PER WEEK / MONTH -------------------- */
    const projectsTimeline = await Project.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1 } },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalGraphs,
          highPriority,
          totalCollaborators,
          projectsTimeline,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load dashboard metrics" },
      { status: 500 },
    );
  }
}
