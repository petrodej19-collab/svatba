import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, COOKIE_MAX_AGE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (password === process.env.GUEST_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid password" }, { status: 401 });
}
