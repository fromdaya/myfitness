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
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>💪</div>
      <div style={{ color: '#9ca3af', fontSize: 16 }}>Loading MyFitness...</div>
    </div>
  )

  if (!user) return <Login />

  const role = profile?.role
  const defaultPath = role === 'admin' ? '/admin' : role === 'trainer' ? '/trainer' : '/client'

  return (
    <Layout>
      <Routes>
        {/* Admin */}
        <Route path="/admin" element={role === 'admin' ? <AdminDashboard /> : <Navigate to={defaultPath} />} />
        <Route path="/admin/trainers" element={role === 'admin' ? <AdminTrainers /> : <Navigate to={defaultPath} />} />
        <Route path="/admin/clients" element={role === 'admin' ? <AdminClients /> : <Navigate to={defaultPath} />} />
        <Route path="/admin/programs" element={role === 'admin' ? <AdminPrograms /> : <Navigate to={defaultPath} />} />
        <Route path="/admin/exercises" element={role === 'admin' ? <AdminExercises /> : <Navigate to={defaultPath} />} />
        {/* Trainer */}
        <Route path="/trainer" element={role === 'trainer' ? <TrainerDashboard /> : <Navigate to={defaultPath} />} />
        <Route path="/trainer/clients" element={role === 'trainer' ? <TrainerClients /> : <Navigate to={defaultPath} />} />
        <Route path="/trainer/programs" element={role === 'trainer' ? <TrainerPrograms /> : <Navigate to={defaultPath} />} />
        <Route path="/trainer/exercises" element={role === 'trainer' ? <TrainerExercises /> : <Navigate to={defaultPath} />} />
        <Route path="/trainer/chat" element={role === 'trainer' ? <TrainerChat /> : <Navigate to={defaultPath} />} />
        {/* Client */}
        <Route path="/client" element={role === 'client' ? <ClientDashboard /> : <Navigate to={defaultPath} />} />
        <Route path="/client/program" element={role === 'client' ? <ClientProgram /> : <Navigate to={defaultPath} />} />
        <Route path="/client/progress" element={role === 'client' ? <ClientProgress /> : <Navigate to={defaultPath} />} />
        <Route path="/client/chat" element={role === 'client' ? <ClientChat /> : <Navigate to={defaultPath} />} />
        {/* Catch all */}
        <Route path="*" element={<Navigate to={defaultPath} />} />
      </Routes>
    </Layout>
  )
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
