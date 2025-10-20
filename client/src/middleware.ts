import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'ar', 'de'];
const DEFAULT_LOCALE = 'en';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // If the path already starts with a supported locale, continue
  const segments = pathname.split('/').filter(Boolean);
  const firstSeg = segments[0];

  if (SUPPORTED_LOCALES.includes(firstSeg)) {
    return NextResponse.next();
  }

  // Redirect root or other non-locale paths to include the default locale
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|static).*)']
};
