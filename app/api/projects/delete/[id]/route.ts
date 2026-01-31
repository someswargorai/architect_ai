import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

connectDB();


export async function DELETE(req: NextRequest,{ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    await Project.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Project Deleted Successfully", success: true },
      {
        status: 200,
      },
    );
  } catch (err) {
    return NextResponse.json(
      { err, success: false },
      {
        status: 200,
      },
    );
  }
}
