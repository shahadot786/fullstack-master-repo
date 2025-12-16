import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies or check if user data exists in localStorage
  // Since we can't access localStorage in middleware, we'll rely on the client-side redirect
  // This middleware is mainly for server-side route protection
  
  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/verify-email"];
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  
  // For now, we'll let the client-side handle auth redirects
  // since we're using localStorage for token storage
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
