import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./app/lib/session";
import { cookies } from "next/headers";

// 1. Specify protected and public routes
const protectedRoutes = [
  "/start",
  "/history",
  "/player",
  "/tournament",
  // "/api",
];
const publicRoutes = ["/login", "/signup", "/", "public-elo"];

export default async function middleware(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // 4. Redirect
  if (isProtectedRoute && !session?.playerId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  //   if (
  //     isPublicRoute &&
  //     session?.playerId &&
  //     !req.nextUrl.pathname.startsWith("/start")
  //   ) {
  //     return NextResponse.redirect(new URL("/start", req.nextUrl));
  //   }

  return NextResponse.next();
}
