import { adminAuth } from '@/utils/firebaseAdminConfig';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { idToken } = await request.json();
    
    if (!idToken) {
      return new Response('Token no proporcionado', { status: 400 });
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días

    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    cookies().set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return Response.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Error al crear la cookie de sesión:', error);
    return Response.json({ error: error.message }, { status: 401 });
  }
}