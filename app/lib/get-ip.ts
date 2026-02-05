import { headers } from "next/headers";

export async function getIP() {
  
  const header = await headers();
  const forwardedFor = header.get("x-forwarded-for");
  return forwardedFor?.split(",")[0] ?? "127.0.0.1";
}
