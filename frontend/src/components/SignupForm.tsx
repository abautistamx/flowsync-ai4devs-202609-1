import { useState } from 'react'
import type { FormEvent } from 'react'
import { signup, AuthError } from '../api/auth'
import './AuthForm.css'

interface SignupFormProps {
  onSuccess: (token: string) => void
}

function SignupForm({ onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    try {
      const { token } = await signup({ email, password, passwordConfirmation })
      onSuccess(token)
    } catch (error) {
      setErrorMessage(error instanceof AuthError ? error.message : 'No se pudo crear la cuenta.')
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h1>Crear cuenta</h1>

        <label className="auth-field" htmlFor="signup-email">
          Email
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="auth-input"
            disabled={submitting}
            required
          />
        </label>

        <label className="auth-field" htmlFor="signup-password">
          Contraseña
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={32}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="auth-input"
            disabled={submitting}
            required
          />
        </label>

        <label className="auth-field" htmlFor="signup-password-confirmation">
          Repite la contraseña
          <input
            id="signup-password-confirmation"
            name="passwordConfirmation"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={32}
            value={passwordConfirmation}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            className="auth-input"
            disabled={submitting}
            required
          />
        </label>

        {errorMessage && (
          <p className="auth-error" role="alert">
            {errorMessage}
          </p>
        )}

        <button type="submit" className="auth-submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  )
}

export default SignupForm
