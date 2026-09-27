const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3333'

export interface ApiErrorDetail {
  message: string
  field?: string
  rule?: string
}

/**
 * Error normalizado de la API. `status` es 0 cuando no hubo respuesta
 * (servidor caído, CORS, sin red).
 */
export class ApiError extends Error {
  readonly status: number
  readonly errors: ApiErrorDetail[]

  constructor(status: number, errors: ApiErrorDetail[]) {
    super(errors[0]?.message ?? `Request failed with status ${status}`)
    this.status = status
    this.errors = errors
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST'
  body?: unknown
  token?: string
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json()
  } catch {
    return null
  }
}

function extractErrors(body: unknown): ApiErrorDetail[] {
  if (body && typeof body === 'object') {
    const { errors, message } = body as { errors?: unknown; message?: unknown }
    if (Array.isArray(errors)) {
      return errors.filter(
        (error): error is ApiErrorDetail =>
          Boolean(error) && typeof (error as ApiErrorDetail).message === 'string'
      )
    }
    if (typeof message === 'string') {
      return [{ message }]
    }
  }
  return []
}

/**
 * Hace una petición JSON al backend y devuelve el contenido de `{ data }`.
 */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, [])
  }

  const payload = await readJson(response)
  if (!response.ok) {
    throw new ApiError(response.status, extractErrors(payload))
  }

  return (payload as { data: T }).data
}
