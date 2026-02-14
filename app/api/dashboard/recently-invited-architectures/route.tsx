import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Project from "@/app/models/project";
import { verifyToken } from "../../middleware/verify-token.middleware";

export async function GET(req: NextRequest) {
  const user = verifyToken(req);
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userObjectId= new mongoose.Types.ObjectId(user.id);
  try {
    const query: {
      "permissbleArray.user": mongoose.Types.ObjectId 
    ;
    } = {  "permissbleArray.user": userObjectId };

    const projects = await Project.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json({projects, success: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
