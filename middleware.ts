import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {

   const authToken = request.cookies.get('auth-token')?.value
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isResetPasswordPage = request.nextUrl.pathname === '/reset-password'

  // Allow access to /login and /reset-password pages without authentication
  if (!authToken && !isLoginPage && !isResetPasswordPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect logged-in users away from the /login page
  if (authToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
