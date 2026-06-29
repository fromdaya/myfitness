import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ trainers: 0, clients: 0, programs: 0, exercises: 0 })

  useEffect(() => {
    async function load() {
      const [t, c, p, e] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'trainer'),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'client'),
        supabase.from('programs').select('id', { count: 'exact' }),
        supabase.from('exercises').select('id', { count: 'exact' }),
      ])
      setStats({ trainers: t.count || 0, clients: c.count || 0, programs: p.count || 0, exercises: e.count || 0 })
    }
    load()
  }, [])

  const cards = [
    { label: 'Trainers', value: stats.trainers, icon: '🏋️', color: '#7c3aed' },
    { label: 'Clients', value: stats.clients, icon: '👥', color: '#1a56db' },
    { label: 'Programs', value: stats.programs, icon: '📋', color: '#0e9f6e' },
    { label: 'Exercises', value: stats.exercises, icon: '💪', color: '#f59e0b' },
  ]

  return (
    <div>
      <h1 style={s.h1}>Welcome back, {profile?.full_name?.split(' ')[0]} 👋</h1>
      <p style={s.sub}>Here's your platform overview</p>
      <div style={s.grid}>
        {cards.map(c => (
          <div key={c.label} style={s.card}>
            <div style={{ ...s.iconWrap, background: c.color + '15' }}>
              <span style={{ fontSize: 28 }}>{c.icon}</span>
            </div>
            <div style={{ ...s.stat, color: c.color }}>{c.value}</div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={s.notice}>
        <h3 style={{ fontWeight: 700, marginBottom: 8, color: '#7c3aed' }}>🚀 Platform Setup</h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
          Start by adding exercises to the library, then build your 90-day program, then invite your trainers and assign clients.
        </p>
      </div>
    </div>
  )
}

const s = {
  h1: { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  sub: { color: '#6b7280', marginBottom: 32, fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 },
  card: { background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  iconWrap: { width: 56, height: 56, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stat: { fontSize: 36, fontWeight: 800 },
  cardLabel: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  notice: { background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: 14, padding: '1.25rem 1.5rem' }
}
