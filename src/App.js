import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminTrainers from './pages/admin/Trainers'
import AdminClients from './pages/admin/Clients'
import AdminPrograms from './pages/admin/Programs'
import AdminExercises from './pages/admin/Exercises'
import TrainerDashboard from './pages/trainer/Dashboard'
import TrainerClients from './pages/trainer/Clients'
import TrainerPrograms from './pages/trainer/Programs'
import TrainerExercises from './pages/trainer/Exercises'
import TrainerChat from './pages/trainer/Chat'
import ClientDashboard from './pages/client/Dashboard'
import ClientProgram from './pages/client/Program'
import ClientProgress from './pages/client/Progress'
import ClientChat from './pages/client/Chat'

const HOME = { admin: '/admin', trainer: '/trainer', client: '/client' }

function RoleRouter() {
  const { user, profile, profileError, loading } = useAuth()
  const navigate = useNavigate()

  // Once profile loads, redirect to correct home if on wrong path
  useEffect(() => {
    if (!profile) return
    const home = HOME[profile.role]
    const path = window.location.pathname
    // If on root or on wrong role's path, redirect
    if (path === '/' || (!path.startsWith(home))) {
      navigate(home, { replace: true })
    }
  }, [profile, navigate])

  if (loading) return (
    <div style={s.splash}>
      <div style={{ fontSize: 56 }}>💪</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#1a56db' }}>MyFitness</div>
      <div style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>Loading your profile...</div>
    </div>
  )

  if (!user) return <Login />

  if (!profile) return (
    <div style={s.splash}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
        Profile not found
      </div>
      <div style={{ color: '#6b7280', fontSize: 14, maxWidth: 320, textAlign: 'center', lineHeight: 1.7 }}>
        {profileError
          ? <>Error: {profileError}</>
          : <>Your profile row is missing in the database.<br />Make sure the SQL schema ran successfully in Supabase.</>
        }
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button onClick={() => window.location.reload()} style={s.btn}>Retry</button>
        <button onClick={() => supabaseSignOut()} style={s.btnGhost}>Sign Out</button>
      </div>
    </div>
  )

  const role = profile.role

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to={HOME[role] || '/client'} replace />} />

        {/* Admin */}
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/admin/trainers" element={role === 'admin' ? <AdminTrainers /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/admin/clients" element={role === 'admin' ? <AdminClients /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/admin/programs" element={role === 'admin' ? <AdminPrograms /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/admin/exercises" element={role === 'admin' ? <AdminExercises /> : <Navigate to={HOME[role]} replace />} />

        {/* Trainer */}
        <Route path="/trainer" element={role === 'trainer' ? <TrainerDashboard /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/trainer/clients" element={role === 'trainer' ? <TrainerClients /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/trainer/programs" element={role === 'trainer' ? <TrainerPrograms /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/trainer/exercises" element={role === 'trainer' ? <TrainerExercises /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/trainer/chat" element={role === 'trainer' ? <TrainerChat /> : <Navigate to={HOME[role]} replace />} />

        {/* Client */}
        <Route path="/client" element={role === 'client' ? <ClientDashboard /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/client/program" element={role === 'client' ? <ClientProgram /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/client/progress" element={role === 'client' ? <ClientProgress /> : <Navigate to={HOME[role]} replace />} />
        <Route path="/client/chat" element={role === 'client' ? <ClientChat /> : <Navigate to={HOME[role]} replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to={HOME[role] || '/'} replace />} />
      </Routes>
    </Layout>
  )
}

async function supabaseSignOut() {
  const { supabase } = await import('./supabase')
  await supabase.auth.signOut()
  window.location.href = '/'
}

const s = {
  splash: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, background: '#f9fafb' },
  btn: { padding: '10px 24px', background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  btnGhost: { padding: '10px 24px', background: 'transparent', color: '#9ca3af', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, cursor: 'pointer' }
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RoleRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
