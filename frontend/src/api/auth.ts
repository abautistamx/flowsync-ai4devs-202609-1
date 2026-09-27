import { apiRequest, ApiError } from './client'

export interface Credentials {
  email: string
  password: string
}

export interface SignupPayload extends Credentials {
  passwordConfirmation: string
}

export interface AuthUser {
  id: number
  fullName: string | null
  email: string
  createdAt: string
  updatedAt: string
  initials: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
}

/**
 * Error con un mensaje listo para mostrar al usuario.
 */
export class AuthError extends Error {}

const NETWORK_ERROR = 'No se pudo conectar con el servidor. Inténtalo de nuevo.'

const FIELD_MESSAGES: Record<string, Record<string, string>> = {
  email: {
    'database.unique': 'Ya existe una cuenta con ese email.',
    'email': 'Introduce un email válido.',
    'required': 'El email es obligatorio.',
    'maxLength': 'El email es demasiado largo.',
  },
  password: {
    required: 'La contraseña es obligatoria.',
    minLength: 'La contraseña debe tener al menos 8 caracteres.',
    maxLength: 'La contraseña no puede superar los 32 caracteres.',
  },
  passwordConfirmation: {
    required: 'Confirma la contraseña.',
    sameAs: 'Las contraseñas no coinciden.',
    minLength: 'Las contraseñas no coinciden.',
    maxLength: 'Las contraseñas no coinciden.',
  },
}

function validationMessage(error: ApiError): string | undefined {
  for (const detail of error.errors) {
    const message = detail.field && detail.rule && FIELD_MESSAGES[detail.field]?.[detail.rule]
    if (message) return message
  }
  return undefined
}

function toAuthError(error: unknown, fallback: string, invalidCredentials?: string): AuthError {
  if (!(error instanceof ApiError)) return new AuthError(fallback)
  if (error.status === 0) return new AuthError(NETWORK_ERROR)
  if (error.status === 400 && invalidCredentials) return new AuthError(invalidCredentials)
  if (error.status === 422) return new AuthError(validationMessage(error) ?? fallback)
  return new AuthError(fallback)
}

export async function login(credentials: Credentials): Promise<AuthResponse> {
  try {
    return await apiRequest<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: credentials,
    })
  } catch (error) {
    throw toAuthError(error, 'No se pudo iniciar sesión.', 'Email o contraseña incorrectos.')
  }
}

export async function signup(payload: SignupPayload): Promise<AuthResponse> {
  try {
    return await apiRequest<AuthResponse>('/api/v1/auth/signup', {
      method: 'POST',
      body: { ...payload, fullName: null },
    })
  } catch (error) {
    throw toAuthError(error, 'No se pudo crear la cuenta.')
  }
}

/**
 * Devuelve el perfil del usuario autenticado. Relanza el `ApiError` original
 * para que el llamador distinga un token inválido (401) de otros fallos.
 */
export function getProfile(token: string): Promise<AuthUser> {
  return apiRequest<AuthUser>('/api/v1/account/profile', { token })
}

export async function logout(token: string): Promise<void> {
  await apiRequest<unknown>('/api/v1/account/logout', { method: 'POST', token })
}
