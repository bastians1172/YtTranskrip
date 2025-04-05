import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 menit
const RATE_LIMIT_MAX = 9; // Maksimum 9 request per menit
const ipRequests = new Map<string, number>();

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  const requests = ipRequests.get(ip) || 0;

  // RATE LIMIT check
  if (requests >= RATE_LIMIT_MAX) {
    return NextResponse.json(
      { error: "Too Many Requests. Please Try Again Later" },
      { status: 429 }
    );
  }

  ipRequests.set(ip, requests + 1);
  setTimeout(() => ipRequests.delete(ip), RATE_LIMIT_WINDOW);

  // HANYA IZINKAN PATH "/" atau API tertentu
  const pathname = req.nextUrl.pathname;

  // Misalnya kita hanya izinkan akses ke root ("/") dan api/ai-translate
  if (pathname === "/" || pathname.startsWith("/api/ai-translate") || pathname.startsWith("/api/translate")) {
    return NextResponse.next();
  }

  // Jika bukan route yang diizinkan
  return new NextResponse("Access Denied", { status: 403 });
}

export const config = {
  matcher: ["/", "/api/:path*"], // Middleware aktif di semua path root dan api
};
