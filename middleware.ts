import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "./types/common";

const DASHBOARDS: Record<UserRole, string> = {
  user: "/user/dashboard",
  admin: "/admin/dashboard",
};

const PROTECTED_ROUTE_PATTERNS = ["/user/", "/admin/"];

const isProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTE_PATTERNS.some((route) => pathname.startsWith(route));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req });

  // Redirect authenticated users away from auth pages
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(
      new URL(DASHBOARDS[token.role as UserRole], req.url)
    );
  }

  // Handle protected routes (including all patient routes)
  if (isProtectedRoute(pathname)) {
    if (!token) {
      const signInUrl = new URL("/auth/sign-in", req.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user is trying to access their appropriate dashboard
    const isDashboardRoute = Object.values(DASHBOARDS).some((path) =>
      pathname.startsWith(path)
    );

    if (isDashboardRoute) {
      const userDashboard = DASHBOARDS[token.role as UserRole];
      if (!pathname.startsWith(userDashboard)) {
        return NextResponse.redirect(new URL(userDashboard, req.url));
      }
    }

    // Additional role-based access control for protected routes
    if (pathname.startsWith("/user") && token.role !== "user") {
      return NextResponse.redirect(
        new URL(DASHBOARDS[token.role as UserRole], req.url)
      );
    }

    if (pathname.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(
        new URL(DASHBOARDS[token.role as UserRole], req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
