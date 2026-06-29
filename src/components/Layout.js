import './Layout.css'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV = {
  admin: [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/trainers', label: 'Trainers', icon: '🏋️' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/programs', label: 'Programs', icon: '📋' },
    { path: '/admin/exercises', label: 'Exercises', icon: '💪' },
  ],
  trainer: [
    { path: '/trainer', label: 'Dashboard', icon: '📊' },
    { path: '/trainer/clients', label: 'My Clients', icon: '👥' },
    { path: '/trainer/programs', label: 'Programs', icon: '📋' },
    { path: '/trainer/exercises', label: 'Exercises', icon: '💪' },
    { path: '/trainer/chat', label: 'Messages', icon: '💬' },
  ],
  client: [
    { path: '/client', label: 'Today', icon: '🎯' },
    { path: '/client/program', label: 'Program', icon: '📋' },
    { path: '/client/progress', label: 'Progress', icon: '📈' },
    { path: '/client/chat', label: 'Coach', icon: '💬' },
  ]
}

const ROLE_COLOR = { admin: '#7c3aed', trainer: '#1a56db', client: '#0e9f6e' }

export default function Layout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const nav = NAV[profile?.role] || []
  const color = ROLE_COLOR[profile?.role] || '#1a56db'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      {/* Sidebar */}
      <aside className="sidebar" style={{ borderColor: color }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '0 4px' }}>
          <span style={{ fontSize: 28 }}>💪</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color }}>MyFitness</div>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>{profile?.role}</div>
          </div>
        </div>

        {/* Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: '#f9fafb', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
            {profile?.full_name?.[0]?.toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email}</div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {nav.map(item => {
            const active = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', border: 'none', borderRadius: 10,
                  background: active ? color + '15' : 'transparent',
                  color: active ? color : '#6b7280',
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  textAlign: 'left', cursor: 'pointer', transition: 'all .15s'
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button onClick={signOut} style={{ border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, padding: '10px 12px', textAlign: 'left', cursor: 'pointer' }}>
          ← Sign Out
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="mobile-nav">
        {nav.slice(0, 5).map(item => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 2, border: 'none', background: 'none',
                color: active ? color : '#9ca3af', fontWeight: 500, cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

    </div>
  )
}
