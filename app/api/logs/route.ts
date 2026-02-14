import { connectDB } from "@/app/lib/mongodb";
import activity from "@/app/models/activity";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../middleware/verify-token.middleware";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("projectId");
    const search = req.nextUrl.searchParams.get("q")?.trim();

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId", success: false },
        { status: 400 },
      );
    }

    const query = search
      ? {
          projectId,
          email: { $regex: search, $options: "i" },
        }
      : { projectId };

    const logs = await activity.find(query).sort({ createdAt: -1 });

    return NextResponse.json(
      { logs, message: "Logs fetched", success: true },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching logs", success: false },
      { status: 500 },
    );
  }
}
