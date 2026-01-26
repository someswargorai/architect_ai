import { NextResponse, NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  const devToken = request.cookies.get("next-auth.session-token")?.value;
  const prodToken = request.cookies.get("__Secure-next-auth.session-token")
    ?.value;

  const token = devToken || prodToken;

  const { pathname } = request.nextUrl;

  // Not logged in
  if (!token) {
    if (pathname === "/auth") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (token && pathname === "/auth") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // "/auth",
    // "/dashboard/:path*",
    // "/projects/:path*"
  ],
};
