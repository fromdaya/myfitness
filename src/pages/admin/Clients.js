import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [trainers, setTrainers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [{ data: c }, { data: t }] = await Promise.all([
      supabase.from('profiles').select('*, trainer:profiles!trainer_id(full_name)').eq('role','client').order('full_name'),
      supabase.from('profiles').select('id, full_name').eq('role','trainer').order('full_name'),
    ])
    setClients(c || [])
    setTrainers(t || [])
    setLoading(false)
  }

  async function toggleBilling(client) {
    const next = client.billing_status === 'free_override' ? 'free' : 'free_override'
    await supabase.from('profiles').update({ billing_status: next }).eq('id', client.id)
    load()
  }

  async function assignTrainer(clientId, trainerId) {
    await supabase.from('profiles').update({ trainer_id: trainerId || null }).eq('id', clientId)
    load()
  }

  let filtered = clients
  if (filter === 'With Trainer') filtered = filtered.filter(c => c.trainer_id)
  if (filter === 'Direct') filtered = filtered.filter(c => !c.trainer_id)
  if (search) filtered = filtered.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const counts = {
    All: clients.length,
    'With Trainer': clients.filter(c => c.trainer_id).length,
    Direct: clients.filter(c => !c.trainer_id).length,
  }

  return (
    <div>
      <div style={s.topRow}>
        <div>
          <h1 style={s.h1}>Clients</h1>
          <p style={s.sub}>{clients.length} total clients</p>
        </div>
      </div>

      <div style={s.pills}>
        {['All','With Trainer','Direct'].map(f => (
          <button key={f} style={{...s.pill,...(filter===f?s.pillActive:{})}} onClick={() => setFilter(f)}>
            {f} <span style={s.pillNum}>{counts[f]}</span>
          </button>
        ))}
      </div>

      <input style={s.search} placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />

      {loading ? <div style={s.loading}>Loading...</div> : (
        <div style={s.list}>
          {filtered.map(c => (
            <div key={c.id} style={s.card}>
              <div style={s.avatar}>{c.full_name?.[0]?.toUpperCase()}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={s.name}>{c.full_name}</div>
                <div style={s.email}>{c.email}</div>
                <div style={s.meta}>
                  <span style={{ ...s.badge, ...(c.billing_status === 'active' ? s.badgeGreen : c.billing_status === 'free_override' ? s.badgePurple : s.badgeGray) }}>
                    {c.billing_status}
                  </span>
                  <span style={s.tagGray}>{c.trainer?.full_name || 'No trainer'}</span>
                </div>
              </div>
              <div style={s.actions}>
                <select style={s.trainerSelect}
                  value={c.trainer_id || ''}
                  onChange={e => assignTrainer(c.id, e.target.value)}>
                  <option value="">No trainer</option>
                  {trainers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
                </select>
                <button style={s.freeBtn} onClick={() => toggleBilling(c)}>
                  {c.billing_status === 'free_override' ? 'Remove Free' : 'Gift Free'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={s.empty}>No clients found.</div>}
        </div>
      )}
    </div>
  )
}

const s = {
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 },
  h1: { fontSize:26, fontWeight:800, marginBottom:4 },
  sub: { color:'#6b7280', fontSize:14 },
  pills: { display:'flex', gap:8, marginBottom:14, flexWrap:'wrap' },
  pill: { padding:'6px 16px', border:'1.5px solid #e5e7eb', borderRadius:20, background:'white', fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151', display:'flex', gap:6, alignItems:'center' },
  pillActive: { background:'#1a56db', color:'white', borderColor:'#1a56db' },
  pillNum: { background:'rgba(255,255,255,0.25)', padding:'0 6px', borderRadius:10, fontSize:11 },
  search: { width:'100%', padding:'10px 14px', border:'1.5px solid #e5e7eb', borderRadius:10, fontSize:14, fontFamily:'inherit', outline:'none', marginBottom:16 },
  loading: { textAlign:'center', padding:'3rem', color:'#9ca3af' },
  list: { display:'flex', flexDirection:'column', gap:10 },
  card: { background:'white', borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:12, boxShadow:'0 1px 3px rgba(0,0,0,0.06)', flexWrap:'wrap' },
  avatar: { width:40, height:40, borderRadius:'50%', background:'#0e9f6e', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, flexShrink:0 },
  name: { fontWeight:600, fontSize:14 },
  email: { fontSize:12, color:'#9ca3af', marginTop:1 },
  meta: { display:'flex', gap:8, marginTop:5, flexWrap:'wrap', alignItems:'center' },
  badge: { fontSize:12, padding:'2px 8px', borderRadius:10, fontWeight:500 },
  badgeGreen: { background:'#d1fae5', color:'#065f46' },
  badgePurple: { background:'#ede9fe', color:'#5b21b6' },
  badgeGray: { background:'#f3f4f6', color:'#6b7280' },
  tagGray: { fontSize:12, color:'#6b7280' },
  actions: { display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' },
  trainerSelect: { padding:'6px 10px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:12, fontFamily:'inherit', cursor:'pointer' },
  freeBtn: { padding:'6px 12px', border:'1px solid #e5e7eb', borderRadius:7, fontSize:12, cursor:'pointer', background:'white', whiteSpace:'nowrap' },
  empty: { textAlign:'center', padding:'2rem', color:'#9ca3af' },
}
