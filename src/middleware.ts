import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Rewrite /uploads/* to /api/uploads/* so uploaded files are served via API route
  // This is the most reliable method for standalone mode (Docker/Coolify)
  if (url.pathname.startsWith('/uploads/')) {
    url.pathname = url.pathname.replace(/^\/uploads\//, '/api/uploads/');
    return NextResponse.rewrite(url);
  }
}

export const config = {
  matcher: ['/uploads/:path*'],
};
