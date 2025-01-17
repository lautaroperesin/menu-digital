import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies(); // Accede a las cookies dinámicas
    cookieStore.delete('session'); // Elimina la cookie de sesión

    return new Response('Sesión cerrada correctamente', { status: 200 });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}