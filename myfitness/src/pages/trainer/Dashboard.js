import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function TrainerDashboard() {
  const { profile } = useAuth()
  const [clients, setClients] = useState([])

  useEffect(() => {
    if (!profile) return
    supabase.from('profiles').select('*').eq('trainer_id', profile.id).eq('role', 'client')
      .then(({ data }) => setClients(data || []))
  }, [profile])

  return (
    <div>
      <h1 style={s.h1}>Good day, {profile?.full_name?.split(' ')[0]} 💪</h1>
      <p style={s.sub}>You have {clients.length} client{clients.length !== 1 ? 's' : ''}</p>

      <div style={s.grid}>
        <Stat icon="👥" value={clients.length} label="My Clients" color="#1a56db" />
        <Stat icon="✅" value="—" label="Completed Today" color="#0e9f6e" />
        <Stat icon="💬" value="—" label="Unread Messages" color="#f59e0b" />
      </div>

      <h2 style={s.h2}>My Clients</h2>
      {clients.length === 0
        ? <div style={s.empty}>No clients yet. Ask your admin to assign clients to you.</div>
        : <div style={s.clientList}>
            {clients.map(c => (
              <div key={c.id} style={s.clientCard}>
                <div style={s.cAvatar}>{c.full_name?.[0]?.toUpperCase()}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.full_name}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{c.email}</div>
                </div>
                <div style={{ ...s.badge, background: c.billing_status === 'active' ? '#d1fae5' : '#f3f4f6', color: c.billing_status === 'active' ? '#065f46' : '#6b7280' }}>
                  {c.billing_status}
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}

function Stat({ icon, value, label, color }) {
  return (
    <div style={s.card}>
      <div style={{ ...s.iconWrap, background: color + '15' }}><span style={{ fontSize: 26 }}>{icon}</span></div>
      <div style={{ ...s.stat, color }}>{value}</div>
      <div style={s.cardLabel}>{label}</div>
    </div>
  )
}

const s = {
  h1: { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  h2: { fontSize: 18, fontWeight: 700, margin: '24px 0 12px' },
  sub: { color: '#6b7280', marginBottom: 28, fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14, marginBottom: 8 },
  card: { background: 'white', borderRadius: 14, padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  iconWrap: { width: 50, height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stat: { fontSize: 30, fontWeight: 800 },
  cardLabel: { fontSize: 12, color: '#6b7280', fontWeight: 500 },
  empty: { background: 'white', borderRadius: 14, padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  clientList: { display: 'flex', flexDirection: 'column', gap: 10 },
  clientCard: { background: 'white', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  cAvatar: { width: 40, height: 40, borderRadius: '50%', background: '#1a56db', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 },
  badge: { fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500 }
}
