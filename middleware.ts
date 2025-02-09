import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // const isAuthenticated = request.cookies.get('auth-token')
  const authToken = request.cookies.get('auth-token')?.value;

  const isLoginPage = request.nextUrl.pathname === '/login'

  // if (!isAuthenticated && !isLoginPage) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  // if (isAuthenticated && isLoginPage) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }
   // إذا لم يكن هناك توكن وصفحة الدخول غير مطلوبة
  //  if (!authToken && !isLoginPage) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // // إذا كان هناك توكن وحاول الدخول إلى صفحة تسجيل الدخول
  // if (authToken && isLoginPage) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
