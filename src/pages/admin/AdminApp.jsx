import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Loader2, LogOut, ExternalLink, Lock, AlertTriangle } from 'lucide-react'
import Button from '../../components/ui/Button'
import { CloverMark } from '../../components/brand/Logo'
import { TextField } from '../../components/form/fields'
import { adminApi } from '../../lib/adminApi'
import { usePageMeta } from '../../lib/seo'
import { routes } from '../../data/site'
import AdminJobs from './AdminJobs'
import AdminJobEditor from './AdminJobEditor'

/**
 * The Gen Clover admin portal, at /admin. Nothing on the public site links
 * here, it is noindex, and every action is checked again on the server, so
 * this UI is a convenience rather than the security boundary.
 */

const AdminContext = createContext(null)
export const useAdmin = () => useContext(AdminContext)

const AdminApp = () => {
  usePageMeta({ title: 'Admin | Gen Clover', noIndex: true })
  const [session, setSession] = useState({ status: 'checking', email: null })

  const check = useCallback(() => {
    adminApi
      .session()
      .then(({ email }) => setSession({ status: 'in', email }))
      .catch(() => setSession({ status: 'out', email: null }))
  }, [])

  useEffect(check, [check])

  const signOut = async () => {
    await adminApi.logout().catch(() => {})
    setSession({ status: 'out', email: null })
  }

  /** Any 401 from the API means the session expired: go back to sign-in. */
  const onExpired = useCallback(() => setSession((s) => ({ ...s, status: 'out', email: null })), [])

  if (session.status === 'checking') {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-950">
        <Loader2 className="h-6 w-6 animate-spin text-silver-500" aria-label="Loading" />
      </div>
    )
  }

  if (session.status === 'out') {
    return <SignIn onSignedIn={(email) => setSession({ status: 'in', email })} />
  }

  return (
    <AdminContext.Provider value={{ email: session.email, onExpired }}>
      <div className="min-h-screen bg-ink-950">
        <header className="sticky top-0 z-40 border-b border-ink-800 bg-ink-950/90 backdrop-blur">
          <div className="container flex h-14 items-center justify-between gap-4">
            <Link to="/admin" className="flex items-center gap-2.5">
              <CloverMark className="h-6 w-6" />
              <span className="font-display text-sm font-semibold uppercase tracking-brand text-silver-100">
                Gen Clover <span className="text-accent-500">Admin</span>
              </span>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link
                to={routes.careers}
                target="_blank"
                className="hidden items-center gap-1.5 rounded-md px-2.5 py-1.5 text-silver-400 hover:bg-ink-800 hover:text-silver-100 sm:inline-flex"
              >
                Careers page
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <span className="hidden text-silver-600 md:inline">{session.email}</span>
              <Button type="button" variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <Routes>
            <Route index element={<AdminJobs />} />
            <Route path="jobs/new" element={<AdminJobEditor />} />
            <Route path="jobs/:id" element={<AdminJobEditor />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </AdminContext.Provider>
  )
}

const SignIn = ({ onSignedIn }) => {
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const { email } = await adminApi.login(values.email.trim(), values.password)
      onSignedIn(email)
    } catch (err) {
      setError(err.message)
      setValues((v) => ({ ...v, password: '' }))
    } finally {
      setBusy(false)
    }
  }

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }))

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-950 px-4">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <form onSubmit={onSubmit} className="surface surface-static relative w-full max-w-sm p-7" noValidate>
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-ink-700 bg-ink-900">
          <Lock className="h-4 w-4 text-accent-500" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-semibold text-silver-100">Gen Clover admin</h1>
        <p className="mt-1 text-sm text-silver-500">Sign in with your admin account.</p>

        <div className="mt-6 space-y-4">
          <TextField
            field={{ name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'username' }}
            value={values.email}
            onChange={set}
          />
          <TextField
            field={{ name: 'password', label: 'Password', type: 'password', required: true, autoComplete: 'current-password' }}
            value={values.password}
            onChange={set}
          />
        </div>

        {error && (
          <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-accent-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}

        <Button type="submit" size="md" className="mt-6 w-full" disabled={busy || !values.email || !values.password}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          Sign in
        </Button>
      </form>
    </div>
  )
}

export default AdminApp
