// middleware.ts (gunakan middleware bawaan Next.js)
import { NextResponse } from "next/server";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 2; // Maksimum 10 request per menit

const ipRequests = new Map<string, number>();

export function middleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";

  const now = Date.now();
  const requests = ipRequests.get(ip) || 0;

  if (requests >= RATE_LIMIT_MAX) {
    return NextResponse.json({ error: "Too Many Requests. Please Try Again Later" }, { status: 429 });
  }

  ipRequests.set(ip, requests + 1);
  setTimeout(() => ipRequests.delete(ip), RATE_LIMIT_WINDOW);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/ai-translate/:path*", // Middleware hanya aktif di API route ai-translate
};
