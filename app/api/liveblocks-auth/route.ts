import { NextRequest, NextResponse } from "next/server";
import { Liveblocks } from "@liveblocks/node";
import { getServerSession } from "next-auth";
import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import { authOptions } from "@/lib/auth";


const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY!,
});

export async function POST(req: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions) as {id: string, email:string, name:string};

  if (!session?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const currentUserId = session.id as string;

  const body = await req.json();
  const { room } = body;

  if (!room) {
    return new NextResponse("Missing room id", { status: 400 });
  }

  const project = await Project.findById(room);

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const isOwner = project.user.toString() === currentUserId;

  const { status, body: tokenBody } = await liveblocks.identifyUser(
      currentUserId,
    {
      userInfo: {
        "owner":isOwner,
        "email": session.email,
        "name":session.name
      },
    },
  );
  return new NextResponse(tokenBody, { status });
}
