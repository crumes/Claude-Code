import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sbSession = request.cookies.get('sb-auth-token')?.value;
  const supabaseSession = request.cookies.get('sb:token')?.value;
  const hasSession = sbSession || supabaseSession;

  const isAuthRoute = pathname.startsWith('/auth');
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isPublicRoute = pathname === '/' || pathname === '/auth/login' || pathname === '/auth/signup';

  if (!hasSession) {
    if (!isPublicRoute && !isOnboardingRoute && !isAuthRoute) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  } else {
    if (pathname === '/auth/login' || pathname === '/auth/signup') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
