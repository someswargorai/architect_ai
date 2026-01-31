import { connectDB } from "@/app/lib/mongodb";
import User from "@/app/models/user";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../graphs/[id]/route";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const search = req.nextUrl.searchParams.get("q")?.trim();

    const query = search ? { email: { $regex: search, $options: "i" } } : {};

    const users = await User.find(query)
      .select("email _id")
      .lean();

    return NextResponse.json({ users: users, success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to search users", success: false },
      { status: 500 },
    );
  }
}
