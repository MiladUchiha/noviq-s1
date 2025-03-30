import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

// Configure paths that require authentication and paths for non-authenticated users
const protectedPaths = ['/dashboard', '/profile', '/settings'];
const authPaths = ['/login', '/register', '/forgot-password'];

export async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedPath = protectedPaths.some(protectedPath => path.startsWith(protectedPath));
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath));
  
  // Get the user's token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthenticated = !!token;

  // Case 1: User is authenticated but visiting an auth page - redirect to dashboard
  if (isAuthenticated && isAuthPath) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Case 2: User is not authenticated but visiting a protected page - redirect to login
  if (!isAuthenticated && isProtectedPath) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // Allow all other requests to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public folder
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
}; 