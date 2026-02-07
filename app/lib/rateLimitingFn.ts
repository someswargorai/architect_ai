import { NextResponse } from "next/server";
import { rateLimiter } from "./rateLimit";
import { getIP } from "./get-ip";

export async function rateLimtingFn() {
  const ip = await getIP();

  const { success, limit, remaining, reset } = await rateLimiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        message: "Too many requests",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      },
    );
  }

  return null;
}
