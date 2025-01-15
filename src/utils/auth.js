import { auth } from './firebaseConfig'

export async function handleAuthToken(idToken) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    })
    
    if (!response.ok) {
      throw new Error('Error al procesar la autenticación')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error en handleAuthToken:', error)
    throw error
  }
}

export async function signOutUser() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
    })
    await auth.signOut()
  } catch (error) {
    console.error('Error en signOutUser:', error)
    throw error
  }
}