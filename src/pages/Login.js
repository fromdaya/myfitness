import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', fullName: '', role: 'client' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    if (mode === 'login') {
      const { error } = await signIn(form.email, form.password)
      if (error) setError(error.message)
    } else {
      const { error } = await signUp(form.email, form.password, form.fullName, form.role)
      if (error) setError(error.message)
      else setError('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>💪</div>
        <h1 style={s.title}>MyFitness</h1>
        <p style={s.sub}>Train smarter. Live better.</p>

        <div style={s.tabs}>
          {['login','signup'].map(m => (
            <button key={m} style={{...s.tab, ...(mode===m ? s.tabActive : {})}} onClick={() => { setMode(m); setError('') }}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={s.form}>
          {mode === 'signup' && (
            <>
              <input style={s.input} name="fullName" placeholder="Full name" value={form.fullName} onChange={handle} required />
              <select style={s.input} name="role" value={form.role} onChange={handle}>
                <option value="client">Client</option>
                <option value="trainer">Trainer / Coach</option>
              </select>
            </>
          )}
          <input style={s.input} name="email" type="email" placeholder="Email address" value={form.email} onChange={handle} required />
          <input style={s.input} name="password" type="password" placeholder="Password" value={form.password} onChange={handle} required />
          {error && <p style={s.error}>{error}</p>}
          <button style={s.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a56db 0%, #0e9f6e 100%)', padding: '1rem' },
  card: { background: 'white', borderRadius: 20, padding: '2.5rem 2rem', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  logo: { textAlign: 'center', fontSize: 48, marginBottom: 8 },
  title: { textAlign: 'center', fontSize: 28, fontWeight: 800, color: '#1a56db', marginBottom: 4 },
  sub: { textAlign: 'center', color: '#6b7280', fontSize: 14, marginBottom: 24 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24, background: '#f3f4f6', borderRadius: 10, padding: 4 },
  tab: { flex: 1, padding: '8px 0', border: 'none', borderRadius: 8, background: 'transparent', color: '#6b7280', fontWeight: 500, fontSize: 14 },
  tabActive: { background: 'white', color: '#1a56db', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: { padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 15, outline: 'none', transition: 'border .2s' },
  btn: { padding: '13px', background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, marginTop: 4 },
  error: { fontSize: 13, color: '#ef4444', textAlign: 'center', padding: '8px', background: '#fef2f2', borderRadius: 8 }
}
