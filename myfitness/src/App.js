import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function RoleRouter() {
  const { user, profile, profileError, loading } = useAuth()

  // Loading screen
  if (loading) return (
    <div style={s.splash}>
      <div style={{ fontSize: 56 }}>💪</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#1a56db' }}>MyFitness</div>
      <div style={{ color: '#9ca3af', fontSize: 14 }}>Loading...</div>
    </div>
  )

  // Not logged in
  if (!user) return <Login />

  // Logged in but profile failed to load
  if (!profile) return (
    <div style={s.splash}>
      <div style={{ fontSize: 48 }}>⚠️</div>
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Profile not found</div>
      <div style={{ color: '#6b7280', fontSize: 14, maxWidth: 320, textAlign: 'center', lineHeight: 1.7 }}>
        {profileError || 'Your profile could not be loaded.'}<br />
        Make sure you ran the SQL schema in Supabase and updated your role.
      </div>
      <button onClick={() => window.location.reload()} style={s.retryBtn}>Retry</button>
      <button onClick={() => { require('./supabase').supabase.auth.signOut() }} style={s.signoutBtn}>Sign Out</button>
    </div>
  )

  const role = profile.role

  return (
    <Layout>
      <Routes>
        {/* Default redirect by role */}
        <Route path="/" element={<Navigate to={role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer' : '/client'} replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
        <Route path="/admin/trainers" element={role === 'admin' ? <AdminTrainers /> : <Navigate to="/" replace />} />
        <Route path="/admin/clients" element={role === 'admin' ? <AdminClients /> : <Navigate to="/" replace />} />
        <Route path="/admin/programs" element={role === 'admin' ? <AdminPrograms /> : <Navigate to="/" replace />} />
        <Route path="/admin/exercises" element={role === 'admin' ? <AdminExercises /> : <Navigate to="/" replace />} />

        {/* Trainer routes */}
        <Route path="/trainer" element={role === 'trainer' ? <TrainerDashboard /> : <Navigate to="/" replace />} />
        <Route path="/trainer/clients" element={role === 'trainer' ? <TrainerClients /> : <Navigate to="/" replace />} />
        <Route path="/trainer/programs" element={role === 'trainer' ? <TrainerPrograms /> : <Navigate to="/" replace />} />
        <Route path="/trainer/exercises" element={role === 'trainer' ? <TrainerExercises /> : <Navigate to="/" replace />} />
        <Route path="/trainer/chat" element={role === 'trainer' ? <TrainerChat /> : <Navigate to="/" replace />} />

        {/* Client routes */}
        <Route path="/client" element={role === 'client' ? <ClientDashboard /> : <Navigate to="/" replace />} />
        <Route path="/client/program" element={role === 'client' ? <ClientProgram /> : <Navigate to="/" replace />} />
        <Route path="/client/progress" element={role === 'client' ? <ClientProgress /> : <Navigate to="/" replace />} />
        <Route path="/client/chat" element={role === 'client' ? <ClientChat /> : <Navigate to="/" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

const s = {
  splash: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, background: '#f9fafb' },
  retryBtn: { marginTop: 8, padding: '10px 24px', background: '#1a56db', color: 'white', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  signoutBtn: { padding: '8px 24px', background: 'transparent', color: '#9ca3af', border: '1px solid #e5e7eb', borderRadius: 10, fontSize: 14, cursor: 'pointer' }
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
