import { useState } from 'react'
import type { FormEvent } from 'react'
import { login, AuthError } from '../api/auth'
import './AuthForm.css'

interface LoginFormProps {
  onSuccess: (token: string) => void
}

function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const { token } = await login({ email, password })
      onSuccess(token)
    } catch (error) {
      setErrorMessage(error instanceof AuthError ? error.message : 'No se pudo iniciar sesión.')
      setSubmitting(false)
    }
  }

  const hasError = errorMessage !== ''

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Iniciar sesión</h1>

        <label className="auth-field" htmlFor="login-email">
          Email
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth-input"
            aria-invalid={hasError}
            disabled={submitting}
            required
          />
        </label>

        <label className="auth-field" htmlFor="login-password">
          Contraseña
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input"
            aria-invalid={hasError}
            disabled={submitting}
            required
          />
        </label>

        {hasError && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>

        <p className="auth-switch">
          ¿No tienes cuenta? <a href="#/signup">Regístrate</a>
        </p>
      </form>
    </div>
  )
}

export default LoginForm
