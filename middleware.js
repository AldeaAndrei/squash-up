import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/start", "/history", "/player", "/tournament"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  const sessionCookie = (await cookies()).get("session")?.value;

  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("redirect", path); // preserve original page
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
