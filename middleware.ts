import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isAuthenticatedAsAdmin } from './app/utils/auth'

export default function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  if (pathname.startsWith("/_next") || pathname.startsWith("/images")) {
    return NextResponse.next();
  }

  if (pathname === '/login') {
    const response = NextResponse.next()
    response.cookies.set('token', '', { maxAge: -1 })
    return response
  }

  if (!isAuthenticatedAsAdmin(req)) {
    const loginURL = new URL('/login', origin)
    return NextResponse.redirect(loginURL.toString())
  }

  return NextResponse.next()
}
