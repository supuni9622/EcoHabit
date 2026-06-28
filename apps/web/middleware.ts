import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/api',
  '/_next',
  '/favicon',
  '/icons',
  '/manifest',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths through
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) {
    return NextResponse.next();
  }

  // Check for Firebase auth session cookie
  const sessionCookie =
    request.cookies.get('__session')?.value ??
    request.cookies.get('firebase-auth-token')?.value;

  // If there's no session and we're not on a public path, redirect to login
  // Note: The actual auth check happens client-side via AuthProvider;
  // this middleware provides a lightweight server-side redirect for the root path.
  if (!sessionCookie && (pathname === '/' || pathname === '/home')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).*)'],
};
