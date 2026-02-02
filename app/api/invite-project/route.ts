import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../graphs/[id]/route";
import Project from "@/app/models/project";
import axios from "axios";
import nodemailer from "nodemailer";
import User from "@/app/models/user";

export async function POST(req: NextRequest) {
  try {
    const user = verifyToken(req);
    const me = User.find(user?.id);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, users } = await req.json();

    if (!users || users.length === 0) {
      await Project.findByIdAndUpdate(id, {
        $set: { permissbleArray: [] },
      });

      return NextResponse.json(
        {
          success: true,
          message: "All members removed",
        },
        { status: 200 },
      );
    }

    const project = await Project.findById(id).populate(
      "permissbleArray.user",
      "email name",
    );

    if (!project) {
      return NextResponse.json(
        { error: "Project not found", success: false },
        { status: 404 },
      );
    }

    if (project.user.toString() !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }


    const newUsers = users.filter(
      (u: { _id: string }) =>
        !project.permissbleArray.some(
          (m) => m.user._id.toString() === u._id.toString(),
        ),
    );


    if (newUsers.length === 0) {
      return NextResponse.json({
        message: "No new users to add",
        success: true,
      });
    }

    const transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST!,
      port: 587,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const mailPromises = newUsers.map((u: { email: string }) =>
      transporter.sendMail({
        from: "somgorai726@gmail.com",
        to: u.email,
        subject: `You’ve been invited to collaborate on ${project.name}`,
        text: `You’ve been invited to collaborate on "${project.name}". Open your dashboard to get started.`,
        html: `
      <div
  style="
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 48px 0;
    font-family: 'Poppins', sans-serif;
  "
>
  <table width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table
          width="520"
          cellpadding="0"
          cellspacing="0"
          style="
            background: #111827;
            border-radius: 24px;
            padding: 48px 40px 56px;
            color: #e0e7ff;
            box-shadow: 0 30px 60px rgba(15, 23, 42, 0.7);
            border: 1px solid #374151;
          "
        >
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <div
                style="
                  width: 56px;
                  height: 56px;
                  background: radial-gradient(circle at top left, #fbbf24, #f59e0b);
                  border-radius: 16px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 26px;
                  font-weight: 900;
                  color: white;
                  margin-bottom: 12px;
                  box-shadow: 0 0 12px #fbbf24aa;
                  letter-spacing: 0.05em;
                "
              >
                A
              </div>
              <div
                style="
                  font-size: 20px;
                  font-weight: 800;
                  color: #fafafa;
                  letter-spacing: -0.03em;
                  font-family: 'Merriweather', serif;
                  text-shadow: 0 0 5px #d97706aa;
                "
              >
                ArchitectAI
              </div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td
              style="
                font-size: 24px;
                font-weight: 700;
                color: #f8fafc;
                text-align: center;
                letter-spacing: 0.02em;
                padding-bottom: 20px;
              "
            >
              You’ve been invited
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td
              style="
                padding-top: 6px;
                font-size: 16px;
                line-height: 1.8;
                color: #cbd5f5;
                text-align: center;
                max-width: 420px;
                margin: 0 auto;
              "
            >
              You’ve been added to the project
              <span
                style="
                  color: #ffffff;
                  font-weight: 700;
                  text-shadow: 0 0 3px #fbcf66;
                "
                >${project.name}</span
              >.
              Collaborate visually, iterate faster, and design smarter together.
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding: 20px 0 18px;">
              <a
                href="${process.env.NEXTAUTH_URL}/projects"
                style="
                  background:linear-gradient(135deg, #f59e0b, #b45309);
                  color: #111827;
                  text-decoration: none;
                  padding: 12px 26px;
                  border-radius: 8px;
                  font-size: 15px;
                  font-weight: 600;
                  display: inline-block;
                  transition: background 0.3s ease, box-shadow 0.3s ease;
                "
                onmouseover="this.style.background='linear-gradient(135deg, #b45309, #f59e0b)';"
                onmouseout="this.style.background='linear-gradient(135deg, #f59e0b, #b45309)';"
                >Open Project →</a
              >
            </td>
          </tr>

          <!-- Footer text -->
          <tr>
            <td
              style="
                font-size: 13px;
                color: #94a3b8cc;
                text-align: center;
                font-style: italic;
                padding-bottom: 24px;
              "
            >
              If you weren’t expecting this invitation, you can safely ignore this
              email.
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td
              style="
                border-top: 1px solid #374151;
                padding-bottom: 24px;
                margin-bottom: 16px;
              "
            ></td>
          </tr>

          <!-- Copyright -->
          <tr>
            <td
              style="
                font-size: 12px;
                color: #64748b;
                text-align: center;
                letter-spacing: 0.04em;
                font-weight: 500;
              "
            >
              © ${new Date().getFullYear()} ArchitectAI. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>    
    `,
      }),
    );

    await Promise.all(mailPromises);

    await Project.findByIdAndUpdate(id, {
      $addToSet: {
        permissbleArray: {
          $each: newUsers.map((u: { _id: string }) => ({
            user: u._id,
            permission: "read",
          })),
        },
      },
    });

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
