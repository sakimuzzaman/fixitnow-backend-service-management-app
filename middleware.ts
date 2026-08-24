import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const roleRoutes = {
  "/dashboard/customer": "CUSTOMER",
  "/dashboard/technician": "TECHNICIAN",
  "/dashboard/admin": "ADMIN",
} as const;

export async function middleware(request: NextRequest) {
  const matchedRoute = Object.keys(roleRoutes).find((route) => request.nextUrl.pathname.startsWith(route));
  if (!matchedRoute) return NextResponse.next();

  const token = request.cookies.get("fixitnow_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));

  const secret = process.env.JWT_SECRET;
  if (!secret) return NextResponse.redirect(new URL("/auth/login", request.url));

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role !== roleRoutes[matchedRoute as keyof typeof roleRoutes]) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/auth/login", request.url));
    response.cookies.delete("fixitnow_token");
    return response;
  }
}

export const config = { matcher: ["/dashboard/:path*"] };
