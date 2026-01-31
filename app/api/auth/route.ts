import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/app/models/user";
import { signJwt } from "@/app/lib/jwt";
import { connectDB } from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, password, name, rememberMe } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
   
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 },
        );
      }

      const accessToken = signJwt(
        {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        },
        "1d",
      );

      const refreshToken = signJwt(
        {
          id: user._id.toString(),
          email: user.email,
        },
        rememberMe ? "30d" : "7d",
      );

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.name?.split(" ")[0] || "",
            lastName:
              user.name
                ?.split(" ")
                .slice(1)
                .join(" ") || "",
            profilePic: user.profilePic || "",
          },
          accessToken,
          refreshToken,
        },
      });
    } else {
      if (!name?.trim()) {
        return NextResponse.json(
          { success: false, message: "Name is required for new accounts" },
          { status: 400 },
        );
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const accessToken = signJwt(
        {
          email: email,
          name: name,
        },
        "15m",
      );

      const refreshToken = signJwt(
        {
          email: email,
        },
        rememberMe ? "30d" : "7d",
      );

      user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        accessToken,
        refreshToken,
      });

      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.name?.split(" ")[0] || "",
            lastName:
              user.name
                ?.split(" ")
                .slice(1)
                .join(" ") || "",
            profilePic: user.profilePic || "",
          },
          accessToken,
          refreshToken,
        },
      });
    }
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
