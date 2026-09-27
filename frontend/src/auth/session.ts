export const TOKEN_KEY = 'flowsync.token'

/**
 * Devuelve el token guardado; una cadena vacía cuenta como sesión ausente.
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Sin almacenamiento disponible: la sesión dura lo que dure la pestaña.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Nada que limpiar.
  }
}
