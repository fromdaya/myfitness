import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ trainers:0, clients:0, directClients:0, programs:0, exercises:0 })

  useEffect(() => {
    async function load() {
      const [t, c, dc, p, e] = await Promise.all([
        supabase.from('profiles').select('id', { count:'exact', head:true }).eq('role','trainer'),
        supabase.from('profiles').select('id', { count:'exact', head:true }).eq('role','client'),
        supabase.from('profiles').select('id', { count:'exact', head:true }).eq('role','client').is('trainer_id', null),
        supabase.from('programs').select('id', { count:'exact', head:true }),
        supabase.from('exercises').select('id', { count:'exact', head:true }),
      ])
      setStats({
        trainers: t.count || 0,
        clients: c.count || 0,
        directClients: dc.count || 0,
        programs: p.count || 0,
        exercises: e.count || 0
      })
    }
    load()
  }, [])

  const cards = [
    { label:'Trainers', value:stats.trainers, icon:'🏋️', color:'#7c3aed', path:'/admin/trainers' },
    { label:'Clients', value:stats.clients, icon:'👥', color:'#1a56db', path:'/admin/clients' },
    { label:'Direct Clients', value:stats.directClients, icon:'🙋', color:'#0891b2', path:'/admin/clients' },
    { label:'Programs', value:stats.programs, icon:'📋', color:'#0e9f6e', path:'/admin/programs' },
    { label:'Exercises', value:stats.exercises, icon:'💪', color:'#f59e0b', path:'/admin/exercises' },
  ]

  return (
    <div>
      <h1 style={s.h1}>Welcome back, {profile?.full_name?.split(' ')[0]} 👋</h1>
      <p style={s.sub}>Platform overview</p>

      <div style={s.grid}>
        {cards.map(c => (
          <div key={c.label} style={s.card} onClick={() => navigate(c.path)}>
            <div style={{ ...s.iconWrap, background: c.color + '15' }}>
              <span style={{ fontSize:26 }}>{c.icon}</span>
            </div>
            <div style={{ ...s.stat, color: c.color }}>{c.value}</div>
            <div style={s.cardLabel}>{c.label}</div>
          </div>
        ))}
      </div>

      <div style={s.quickActions}>
        <h2 style={s.h2}>Quick Actions</h2>
        <div style={s.actionGrid}>
          {[
            { label:'Manage Exercises', desc:'Add or edit the exercise library', icon:'💪', path:'/admin/exercises', color:'#f59e0b' },
            { label:'View Trainers', desc:'See all trainers and their clients', icon:'🏋️', path:'/admin/trainers', color:'#7c3aed' },
            { label:'View Clients', desc:'Manage clients and billing', icon:'👥', path:'/admin/clients', color:'#1a56db' },
            { label:'Build Programs', desc:'Create training programs', icon:'📋', path:'/admin/programs', color:'#0e9f6e' },
          ].map(a => (
            <div key={a.label} style={s.actionCard} onClick={() => navigate(a.path)}>
              <div style={{ ...s.actionIcon, background: a.color + '15' }}>{a.icon}</div>
              <div>
                <div style={{ fontWeight:600, fontSize:14 }}>{a.label}</div>
                <div style={{ fontSize:12, color:'#9ca3af', marginTop:2 }}>{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  h1: { fontSize:26, fontWeight:800, marginBottom:4 },
  h2: { fontSize:18, fontWeight:700, marginBottom:14 },
  sub: { color:'#6b7280', marginBottom:28, fontSize:15 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px,1fr))', gap:14, marginBottom:32 },
  card: { background:'white', borderRadius:14, padding:'1.25rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer' },
  iconWrap: { width:50, height:50, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' },
  stat: { fontSize:32, fontWeight:800 },
  cardLabel: { fontSize:12, color:'#6b7280', fontWeight:500, textAlign:'center' },
  quickActions: { background:'white', borderRadius:16, padding:'1.5rem', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
  actionGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:12 },
  actionCard: { display:'flex', alignItems:'center', gap:12, padding:'12px', border:'1px solid #f3f4f6', borderRadius:10, cursor:'pointer' },
  actionIcon: { width:40, height:40, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 },
}