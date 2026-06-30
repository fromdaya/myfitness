import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

export default function Trainers() {
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*, clients:profiles!trainer_id(id)')
      .eq('role', 'trainer')
      .order('full_name')
    setTrainers(data || [])
    setLoading(false)
  }

  async function toggleBilling(trainer) {
    const next = trainer.billing_status === 'active' ? 'free_override' : 'active'
    await supabase.from('profiles').update({ billing_status: next }).eq('id', trainer.id)
    load()
  }

  const filtered = trainers.filter(t =>
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div style={s.topRow}>
        <div>
          <h1 style={s.h1}>Trainers</h1>
          <p style={s.sub}>{trainers.length} trainers on the platform</p>
        </div>
      </div>

      <input style={s.search} placeholder="Search trainers..." value={search} onChange={e => setSearch(e.target.value)} />

      {loading ? <div style={s.loading}>Loading...</div> : (
        <div style={s.list}>
          {filtered.map(t => (
            <div key={t.id} style={s.card}>
              <div style={s.avatar}>{t.full_name?.[0]?.toUpperCase()}</div>
              <div style={{ flex:1 }}>
                <div style={s.name}>{t.full_name}</div>
                <div style={s.email}>{t.email}</div>
                <div style={s.meta}>
                  <span style={s.tagBlue}>{t.clients?.length || 0} clients</span>
                  <span style={{ ...s.badge, ...(t.billing_status === 'active' ? s.badgeGreen : s.badgeGray) }}>
                    {t.billing_status}
                  </span>
                </div>
              </div>
              <button style={s.toggleBtn} onClick={() => toggleBilling(t)}>
                {t.billing_status === 'active' ? 'Waive Fee' : 'Activate'}
              </button>
            </div>
          ))}
          {filtered.length === 0 && <div style={s.empty}>No trainers found.</div>}
        </div>
      )}
    </div>
  )
}

const s = {
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  h1: { fontSize:26, fontWeight:800, marginBottom:4 },
  sub: { color:'#6b7280', fontSize:14 },
  search: { width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, fontFamily:'inherit', outline:'none', marginBottom:16 },
  loading: { textAlign:'center', padding:'3rem', color:'#9ca3af' },
  list: { display:'flex', flexDirection:'column', gap:10 },
  card: { background:'white', borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:14, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' },
  avatar: { width:44, height:44, borderRadius:'50%', background:'#1a56db', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:18, flexShrink:0 },
  name: { fontWeight:600, fontSize:15 },
  email: { fontSize:13, color:'#9ca3af', marginTop:2 },
  meta: { display:'flex', gap:8, marginTop:6, alignItems:'center' },
  tagBlue: { fontSize:12, padding:'2px 10px', borderRadius:10, background:'#eff6ff', color:'#1d4ed8', fontWeight:500 },
  badge: { fontSize:12, padding:'2px 10px', borderRadius:10, fontWeight:500 },
  badgeGreen: { background:'#d1fae5', color:'#065f46' },
  badgeGray: { background:'#f3f4f6', color:'#6b7280' },
  toggleBtn: { padding:'7px 14px', border:'1px solid #e5e7eb', borderRadius:8, fontSize:13, cursor:'pointer', background:'white', whiteSpace:'nowrap' },
  empty: { textAlign:'center', padding:'2rem', color:'#9ca3af' },
}
