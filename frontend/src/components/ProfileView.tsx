import { useEffect, useState } from 'react'
import { getProfile, logout } from '../api/auth'
import type { AuthUser } from '../api/auth'
import { ApiError } from '../api/client'
import './ProfileView.css'

interface ProfileViewProps {
  token: string
  onLogout: () => void
}

type ProfileState =
  { status: 'loading' } | { status: 'ready'; user: AuthUser } | { status: 'error'; message: string }

function ProfileView({ token, onLogout }: ProfileViewProps) {
  const [state, setState] = useState<ProfileState>({ status: 'loading' })
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    let cancelled = false

    getProfile(token)
      .then((user) => {
        if (!cancelled) setState({ status: 'ready', user })
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 401) {
          onLogout()
          return
        }
        setState({
          status: 'error',
          message:
            error instanceof ApiError && error.status === 0
              ? 'No se pudo conectar con el servidor.'
              : 'No se pudo cargar tu perfil.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [token, onLogout])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await logout(token)
    } catch {
      // El token se descarta en el cliente aunque el servidor no responda.
    }
    onLogout()
  }

  return (
    <div className="profile-page">
      <section className="profile-card">
        <h1>Tu perfil</h1>

        {state.status === 'loading' && <p role="status">Cargando perfil…</p>}

        {state.status === 'error' && (
          <p className="profile-error" role="alert">
            {state.message}
          </p>
        )}

        {state.status === 'ready' && (
          <>
            <div className="profile-avatar" aria-hidden="true">
              {state.user.initials}
            </div>
            <dl className="profile-details">
              {state.user.fullName && (
                <>
                  <dt>Nombre</dt>
                  <dd>{state.user.fullName}</dd>
                </>
              )}
              <dt>Email</dt>
              <dd data-testid="profile-email">{state.user.email}</dd>
            </dl>
          </>
        )}

        <button
          type="button"
          className="profile-logout"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Cerrando sesión…' : 'Cerrar sesión'}
        </button>
      </section>
    </div>
  )
}

export default ProfileView
