import { connectDB } from "@/app/lib/mongodb";
import Project from "@/app/models/project";
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../graphs/[id]/route";
import nodemailer from "nodemailer";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY!,
});

type MemberWithUser = {
  user: { _id: string; email: string; name?: string };
  permission: "read" | "write";
  _id: string;
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = req.nextUrl.searchParams.get("id");

    const project = await Project.findById(projectId).populate({
      path: "permissbleArray.user",
      model: "User",
      select: "_id email",
    });

    if(!project){
      return NextResponse.json({ message: "Project not found", success: false }, { status: 404 });
    }

    return NextResponse.json(
      { users: project.permissbleArray, success: true },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json({ err: err, success: false }, { status: 400 });
  }
}



export async function POST(req: NextRequest) {
  try {
    const authUser = verifyToken(req);
    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, userId, permission } = await req.json();

    if (!projectId || !userId || !permission) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!["read", "write"].includes(permission)) {
      return NextResponse.json(
        { error: "Invalid permission" },
        { status: 400 },
      );
    }

   const project = await Project.findById(projectId).populate(
     "permissbleArray.user",
     "email name",
   );


   if (!project) {
     return NextResponse.json({ error: "Project not found" }, { status: 404 });
   }

   if (project.user.toString() !== authUser.id) {
     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
   }

   const member = project.permissbleArray.find(
     (p) => p.user && p.user._id.toString() === userId,
   );

   if (!member) {
     return NextResponse.json(
       { error: "User is not a project member" },
       { status: 404 },
     );
   }


    member.permission = permission;
    await project.save();

    await liveblocks.updateRoom(projectId, {
      usersAccesses: {
        [userId]:
          permission === "write"
            ? ["room:write"]
            : ["room:read", "room:presence:write"],
      },
    });

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST!,
      port: 587,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const roleLabel = permission === "write" ? "Editor" : "Viewer";

    await transporter.sendMail({
      from: `"ArchitectAI" <${process.env.SMTP_USER}>`,
      to: (member?.user as unknown as MemberWithUser["user"])?.email,
      subject: `Your access to ${project.name} has changed`,
      html: `
        <div style="background:#020617;padding:40px;font-family:Inter">
          <h2 style="color:#f8fafc">Access updated</h2>
          <p style="color:#cbd5f5">
            Your role in <b>${project.name}</b> is now:
          </p>
          <div style="
            display:inline-block;
            background:#f59e0b;
            color:#111827;
            padding:8px 14px;
            border-radius:8px;
            font-weight:600;
            margin:12px 0;
          ">
            ${roleLabel}
          </div>
          <p style="color:#94a3b8;font-size:13px">
            You can start collaborating immediately.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: `User permission updated to ${permission}`,
    });
  } catch (err) {
    console.error("Permission update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
