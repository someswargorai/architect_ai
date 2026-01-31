import { verifyToken } from "@/app/api/graphs/[id]/route";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;
    const { name,description } = await req.json();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await Project.findOneAndUpdate(
      {_id:id, user: user.id},
      {
        name: name,
        description: description
      },
      {
        new: true,
      },
    );

    return NextResponse.json(
      { response: response, success: true, message: "Updated successfully" },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ message: err, success: false }, { status: 400 });
  }
}
