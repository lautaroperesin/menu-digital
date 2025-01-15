import { NextResponse } from 'next/server'

export function middleware(request) {
  const path = new URL(request.url).pathname
  
  if (path.startsWith('/admin')) {
    // Verificar la cookie de sesión
    const sessionCookie = request.cookies.get('session')
    
    if (!sessionCookie) {
      if (path !== '/admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}