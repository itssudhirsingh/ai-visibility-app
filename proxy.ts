import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { searchParams, pathname } = request.nextUrl;

  if (searchParams.has("_rsc")) {
    const cleanUrl = new URL(pathname, request.url);
    return NextResponse.redirect(cleanUrl, { status: 301 });
  }

  const response = NextResponse.next();
  // Inject clean path (no query params) for canonical URL generation in layout
  response.headers.set("x-canonical-path", pathname);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};