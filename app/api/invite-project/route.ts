import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../graphs/[id]/route";
import Project from "@/app/models/project";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, users } = await req.json();

    if (!users || users.length === 0) {
      await Project.findByIdAndUpdate(id, {
        $set: { permissbleArray: [] },
      });

      return NextResponse.json({
        success: true,
        message: "All members removed",
      },{status:200});
    }

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 },
      );
    }

    const newUsers = users.filter(
      (u: { _id: string }) => !project.permissbleArray.includes(u._id),
    );

    if (newUsers.length === 0) {
      return NextResponse.json({
        message: "No new users to add",
        success: true,
      });
    }

    await Project.findByIdAndUpdate(id, {
      $addToSet: {
        permissbleArray: { $each: newUsers.map((u: { _id: string }) => u._id) },
      },
    });

    // ----- SEND EMAILS -----
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT),
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS,
    //   },
    // });

    // const mailPromises = newUsers.map((u: { email: string }) =>
    //   transporter.sendMail({
    //     from: `"Project Manager" <${process.env.SMTP_USER}>`,
    //     to: u.email,
    //     subject: `You are invited to a project!`,
    //     text: `Hello,\n\nYou have been added to the project "${project.name}". Please check your dashboard to view the project.\n\nBest regards,\nTeam`,
    //   }),
    // );

    // await Promise.all(mailPromises);

    return NextResponse.json({
      message: "Members added and emails sent successfully",
      success: true,
    });
  } catch (err) {
    console.error("Invite error:", err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        { message: err.message || err, success: false },
        { status: 400 },
      );
    }
  }
}
