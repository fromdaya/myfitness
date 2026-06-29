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

export default function Layout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const nav = NAV[profile?.role] || []
  const roleColor = { admin: '#7c3aed', trainer: '#1a56db', client: '#0e9f6e' }
  const color = roleColor[profile?.role] || '#1a56db'

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <aside style={{ ...s.sidebar, borderColor: color }}>
        <div style={s.brand}>
          <span style={{ fontSize: 28 }}>💪</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color }}>MyFitness</div>
            <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>{profile?.role}</div>
          </div>
        </div>

        <div style={s.profile}>
          <div style={{ ...s.avatar, background: color }}>{profile?.full_name?.[0]?.toUpperCase()}</div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.full_name}</div>
            <div style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.email}</div>
          </div>
        </div>

        <nav style={s.nav}>
          {nav.map(item => {
            const active = location.pathname === item.path
            return (
              <button key={item.path} style={{ ...s.navItem, ...(active ? { ...s.navActive, background: color + '15', color } : {}) }} onClick={() => navigate(item.path)}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <button style={s.signout} onClick={signOut}>← Sign Out</button>
      </aside>

      {/* Main */}
      <main style={s.main}>{children}</main>

      {/* Mobile bottom nav */}
      <nav style={s.mobileNav}>
        {nav.slice(0, 5).map(item => {
          const active = location.pathname === item.path
          return (
            <button key={item.path} style={{ ...s.mobileItem, ...(active ? { color } : {}) }} onClick={() => navigate(item.path)}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <span style={{ fontSize: 10 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}

const s = {
  wrap: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 240, background: 'white', borderRight: '2px solid', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', gap: 0, position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 10, '@media(max-width:768px)': { display: 'none' } },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, padding: '0 4px' },
  profile: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px', background: '#f9fafb', borderRadius: 12, marginBottom: 20 },
  avatar: { width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 16, flexShrink: 0 },
  nav: { display: 'flex', flexDirection: 'column', gap: 4, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', borderRadius: 10, background: 'transparent', color: '#6b7280', fontSize: 14, fontWeight: 500, textAlign: 'left', transition: 'all .15s' },
  navActive: { fontWeight: 600 },
  signout: { border: 'none', background: 'none', color: '#9ca3af', fontSize: 13, padding: '10px 12px', textAlign: 'left' },
  main: { flex: 1, marginLeft: 240, padding: '2rem', paddingBottom: '5rem', minHeight: '100vh', background: '#f9fafb' },
  mobileNav: { display: 'none', position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #e5e7eb', padding: '8px 0 calc(8px + env(safe-area-inset-bottom))', zIndex: 20 },
  mobileItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, border: 'none', background: 'none', color: '#9ca3af', fontWeight: 500 }
}
