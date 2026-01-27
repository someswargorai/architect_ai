import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ success: true });

  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];

  cookieNames.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  });

  return response;
}
