import { useCallback, useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import ProfileView from './components/ProfileView'
import { clearToken, getToken, setToken } from './auth/session'
import './App.css'

type View = 'login' | 'signup' | 'profile'

const VIEW_HASHES: Record<View, string> = {
  login: '#/login',
  signup: '#/signup',
  profile: '#/profile',
}

function viewFromHash(hash: string): View | undefined {
  return (Object.keys(VIEW_HASHES) as View[]).find((view) => VIEW_HASHES[view] === hash)
}

/**
 * Aplica la guardia de sesión: sin token solo se accede a login/signup;
 * con token, login/signup redirigen al perfil.
 */
function resolveView(requested: View | undefined, hasToken: boolean): View {
  if (hasToken) return 'profile'
  return requested === 'signup' ? 'signup' : 'login'
}

function App() {
  const [token, setSessionToken] = useState<string | null>(getToken)
  const [requestedView, setRequestedView] = useState<View | undefined>(() =>
    viewFromHash(window.location.hash)
  )

  useEffect(() => {
    const handleHashChange = () => setRequestedView(viewFromHash(window.location.hash))
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const view = resolveView(requestedView, token !== null)

  // Mantiene la URL alineada con la vista que realmente se muestra.
  useEffect(() => {
    if (window.location.hash !== VIEW_HASHES[view]) {
      window.history.replaceState(null, '', VIEW_HASHES[view])
    }
  }, [view])

  const handleAuthenticated = useCallback((newToken: string) => {
    setToken(newToken)
    setSessionToken(newToken)
  }, [])

  const handleLogout = useCallback(() => {
    clearToken()
    setSessionToken(null)
    setRequestedView('login')
  }, [])

  return (
    <section id="center">
      {view === 'login' && <LoginForm onSuccess={handleAuthenticated} />}
      {view === 'signup' && <SignupForm onSuccess={handleAuthenticated} />}
      {view === 'profile' && token && <ProfileView token={token} onLogout={handleLogout} />}
    </section>
  )
}

export default App
