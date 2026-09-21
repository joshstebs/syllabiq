import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CANONICAL_HOST = 'syllabiq.ca';
const ALIAS_HOSTS = [
  'www.syllabiq.ca',
  'syllabiq.vercel.app',
  'syllabiq-seven.vercel.app',
  'sylabiq.com',
  'www.sylabiq.com'
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Never redirect API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Canonical host — pass through
  if (host === CANONICAL_HOST) {
    return NextResponse.next();
  }

  // Known alias hosts — 301 to canonical
  if (ALIAS_HOSTS.includes(host)) {
    const canonicalUrl = new URL(request.nextUrl);
    canonicalUrl.host = CANONICAL_HOST;
    canonicalUrl.protocol = 'https:';
    return NextResponse.redirect(canonicalUrl, 301);
  }

  // Preview/unknown hosts — serve normally but noindex
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
};
