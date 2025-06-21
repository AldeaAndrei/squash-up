import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = ["/start", "/history", "/player", "/tournament"];
// const publicRoutes = ["/login", "/signup", "/", "public-elo"];

export default async function middleware(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!isProtectedRoute) return NextResponse.next();

  // const isPublicRoute = publicRoutes.includes(path);

  // 3. Get the session cookie
  const sessionCookie = (await cookies()).get("session")?.value;

  // 4. Redirect
  if (isProtectedRoute && !sessionCookie) {
    const res = NextResponse.redirect(new URL("/login", req.nextUrl));
    return res;
  }

  const res = NextResponse.next();
  return res;
}
