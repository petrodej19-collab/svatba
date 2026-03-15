import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, ROUTES } from "@/lib/constants";
import { createMiddlewareSupabaseClient } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = [
  ROUTES.GATE,
  "/api/gate",
  "/_next",
  "/favicon.ico",
  "/images",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check guest gate
  const guestCookie = request.cookies.get(COOKIE_NAME);

  // Auto-unlock via ?pw= query param
  const pw = request.nextUrl.searchParams.get("pw");
  if (pw && pw === process.env.GUEST_PASSWORD) {
    // Strip the pw param from URL so it doesn't linger
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete("pw");
    const response = NextResponse.redirect(cleanUrl);
    response.cookies.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90, // 90 days
    });
    return response;
  }

  if (guestCookie?.value !== "true") {
    return NextResponse.redirect(new URL(ROUTES.GATE, request.url));
  }

  // Check admin routes (except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== ROUTES.ADMIN_LOGIN) {
    const response = NextResponse.next();
    const supabase = createMiddlewareSupabaseClient(request, response);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL(ROUTES.ADMIN_LOGIN, request.url));
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
