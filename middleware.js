import { NextResponse } from 'next/server';
import { adminAuth } from './src/utils/firebaseAdminConfig';

export async function middleware(request) {
  const session = request.cookies.get('session');

  // Redirigir a /admin si no hay cookie de sesión
  if (!session) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  try {
    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(
      session.value,
      true // checkRevoked: true
    );

    // Agregar el usuario decodificado al header para uso posterior si lo necesitas
    const response = NextResponse.next();
    response.headers.set('user', JSON.stringify(decodedClaims));
    
    return response;
  } catch (error) {
    // Si la cookie no es válida o está revocada, redirigir a login
    return NextResponse.redirect(new URL('/admin', request.url));
  }
}

// Configurar en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - admin
     * - api/auth (para no interferir con las rutas de autenticación)
     * - _next/static (archivos estáticos)
     * - _next/image (imágenes optimizadas)
     * - favicon.ico
     */
    '/((?!admin|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};