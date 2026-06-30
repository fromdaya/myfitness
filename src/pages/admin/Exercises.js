import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'

const GROUPS = ['All','Warm-Up','Exercise','Cool-Down']
const SUBGROUPS = {
  'Warm-Up': ['All','General Warmup','Lower Body Warmup','Upper Body Warmup','Mobility & Foam Rolling'],
  'Exercise': ['All','Back','Biceps','Cardio & Conditioning','Chest','Core & Abs','Full Body','Hamstrings & Glutes','Quads','Shoulders','Triceps'],
  'Cool-Down': ['All','General Cooldown','Lower Body Stretch','Upper Body Stretch','Foam Rolling'],
}

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('All')
  const [subgroup, setSubgroup] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name:'', exercise_group:'Exercise', exercise_subgroup:'Full Body', difficulty:'', description:'', how_to:'', benefits:'', common_mistakes:'' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  useEffect(() => {
    let f = exercises
    if (group !== 'All') f = f.filter(e => e.exercise_group === group)
    if (subgroup !== 'All') f = f.filter(e => e.exercise_subgroup === subgroup)
    if (search) f = f.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    setFiltered(f)
  }, [exercises, group, subgroup, search])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('exercises').select('*').order('exercise_group').order('exercise_subgroup').order('name')
    setExercises(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm({ name:'', exercise_group:'Exercise', exercise_subgroup:'Full Body', difficulty:'', description:'', how_to:'', benefits:'', common_mistakes:'' })
    setShowForm(true)
  }

  function openEdit(ex) {
    setEditing(ex)
    setForm({ name:ex.name, exercise_group:ex.exercise_group, exercise_subgroup:ex.exercise_subgroup, difficulty:ex.difficulty||'', description:ex.description||'', how_to:ex.how_to||'', benefits:ex.benefits||'', common_mistakes:ex.common_mistakes||'' })
    setShowForm(true)
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { ...form, difficulty: form.difficulty || null, is_approved: true }
    if (editing) {
      await supabase.from('exercises').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('exercises').insert(payload)
    }
    setSaving(false)
    setShowForm(false)
    load()
  }

  async function del(id) {
    if (!window.confirm('Delete this exercise?')) return
    await supabase.from('exercises').delete().eq('id', id)
    load()
  }

  const subgroupOptions = group !== 'All' ? (SUBGROUPS[group] || ['All']) : ['All']
  const groupCounts = exercises.reduce((acc,e) => { acc[e.exercise_group] = (acc[e.exercise_group]||0)+1; return acc },{})

  return (
    <div>
      <div style={s.topRow}>
        <div>
          <h1 style={s.h1}>Exercise Library</h1>
          <p style={s.sub}>{exercises.length} exercises across all categories</p>
        </div>
        <button style={s.addBtn} onClick={openNew}>+ Add Exercise</button>
      </div>

      {/* Group pills */}
      <div style={s.pills}>
        {GROUPS.map(g => (
          <button key={g} style={{...s.pill, ...(group===g ? s.pillActive : {})}}
            onClick={() => { setGroup(g); setSubgroup('All') }}>
            {g} {g !== 'All' && groupCounts[g] ? <span style={s.pillCount}>{groupCounts[g]}</span> : null}
          </button>
        ))}
      </div>

      {/* Search + subgroup filter */}
      <div style={s.filterRow}>
        <input style={s.search} placeholder="Search exercises..." value={search} onChange={e => setSearch(e.target.value)} />
        {group !== 'All' && (
          <select style={s.select} value={subgroup} onChange={e => setSubgroup(e.target.value)}>
            {subgroupOptions.map(sg => <option key={sg}>{sg}</option>)}
          </select>
        )}
        <span style={s.count}>{filtered.length} shown</span>
      </div>

      {/* Exercise list */}
      {loading ? <div style={s.loading}>Loading exercises...</div> : (
        <div style={s.list}>
          {filtered.map(ex => (
            <div key={ex.id} style={s.row}>
              <div style={s.rowLeft}>
                <div style={s.exName}>{ex.name}</div>
                <div style={s.tags}>
                  <span style={{...s.tag, ...groupColor(ex.exercise_group)}}>{ex.exercise_group}</span>
                  <span style={s.tagGray}>{ex.exercise_subgroup}</span>
                  {ex.difficulty && <span style={s.tagGray}>{ex.difficulty}</span>}
                </div>
              </div>
              <div style={s.rowActions}>
                <button style={s.editBtn} onClick={() => openEdit(ex)}>Edit</button>
                <button style={s.delBtn} onClick={() => del(ex.id)}>✕</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div style={s.empty}>No exercises found.</div>}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div style={s.overlay} onClick={() => setShowForm(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <h2 style={s.modalTitle}>{editing ? 'Edit Exercise' : 'Add Exercise'}</h2>
            <div style={s.formGrid}>
              <label style={s.label}>Exercise Name *
                <input style={s.input} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Back Squat" />
              </label>
              <label style={s.label}>Group
                <select style={s.input} value={form.exercise_group} onChange={e => setForm(f=>({...f,exercise_group:e.target.value}))}>
                  <option>Warm-Up</option><option>Exercise</option><option>Cool-Down</option>
                </select>
              </label>
              <label style={s.label}>Subgroup
                <input style={s.input} value={form.exercise_subgroup} onChange={e => setForm(f=>({...f,exercise_subgroup:e.target.value}))} placeholder="e.g. Quads" />
              </label>
              <label style={s.label}>Difficulty
                <select style={s.input} value={form.difficulty} onChange={e => setForm(f=>({...f,difficulty:e.target.value}))}>
                  <option value="">—</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
                </select>
              </label>
            </div>
            <label style={s.label}>Description
              <textarea style={{...s.input,...s.ta}} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} rows={2} placeholder="Brief description" />
            </label>
            <label style={s.label}>How To
              <textarea style={{...s.input,...s.ta}} value={form.how_to} onChange={e => setForm(f=>({...f,how_to:e.target.value}))} rows={3} placeholder="Step-by-step instructions" />
            </label>
            <label style={s.label}>Benefits
              <textarea style={{...s.input,...s.ta}} value={form.benefits} onChange={e => setForm(f=>({...f,benefits:e.target.value}))} rows={2} placeholder="Why do this exercise?" />
            </label>
            <label style={s.label}>Common Mistakes
              <textarea style={{...s.input,...s.ta}} value={form.common_mistakes} onChange={e => setForm(f=>({...f,common_mistakes:e.target.value}))} rows={2} placeholder="What to avoid" />
            </label>
            <div style={s.modalBtns}>
              <button style={s.cancelBtn} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={s.saveBtn} onClick={save} disabled={saving}>{saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Exercise'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function groupColor(g) {
  if (g === 'Warm-Up') return { background:'#fef3c7', color:'#92400e' }
  if (g === 'Cool-Down') return { background:'#dbeafe', color:'#1e40af' }
  return { background:'#d1fae5', color:'#065f46' }
}

const s = {
  topRow: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20, flexWrap:'wrap', gap:12 },
  h1: { fontSize:26, fontWeight:800, marginBottom:4 },
  sub: { color:'#6b7280', fontSize:14 },
  addBtn: { background:'#7c3aed', color:'white', border:'none', borderRadius:10, padding:'10px 20px', fontSize:14, fontWeight:600, cursor:'pointer' },
  pills: { display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' },
  pill: { padding:'6px 16px', border:'1.5px solid #e5e7eb', borderRadius:20, background:'white', fontSize:13, fontWeight:500, cursor:'pointer', color:'#374151' },
  pillActive: { background:'#7c3aed', color:'white', borderColor:'#7c3aed' },
  pillCount: { marginLeft:6, background:'rgba(255,255,255,0.3)', padding:'1px 6px', borderRadius:10, fontSize:11 },
  filterRow: { display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap' },
  search: { flex:1, minWidth:200, padding:'9px 12px', border:'1.5px solid #e5e7eb', borderRadius:9, fontSize:14, fontFamily:'inherit', outline:'none' },
  select: { padding:'9px 12px', border:'1.5px solid #e5e7eb', borderRadius:9, fontSize:14, fontFamily:'inherit', outline:'none', background:'white' },
  count: { fontSize:13, color:'#9ca3af', whiteSpace:'nowrap' },
  loading: { textAlign:'center', padding:'3rem', color:'#9ca3af' },
  list: { display:'flex', flexDirection:'column', gap:6 },
  row: { background:'white', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 3px rgba(0,0,0,0.05)' },
  rowLeft: { flex:1 },
  exName: { fontWeight:600, fontSize:14, marginBottom:5 },
  tags: { display:'flex', gap:6, flexWrap:'wrap' },
  tag: { fontSize:11, padding:'2px 8px', borderRadius:10, fontWeight:500 },
  tagGray: { fontSize:11, padding:'2px 8px', borderRadius:10, background:'#f3f4f6', color:'#6b7280' },
  rowActions: { display:'flex', gap:8 },
  editBtn: { padding:'5px 12px', border:'1px solid #d1d5db', borderRadius:7, background:'white', fontSize:12, cursor:'pointer' },
  delBtn: { padding:'5px 10px', border:'none', borderRadius:7, background:'#fef2f2', color:'#ef4444', fontSize:12, cursor:'pointer' },
  empty: { textAlign:'center', padding:'2rem', color:'#9ca3af' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' },
  modal: { background:'white', borderRadius:16, padding:'2rem', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto' },
  modalTitle: { fontSize:20, fontWeight:700, marginBottom:20 },
  formGrid: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 },
  label: { display:'flex', flexDirection:'column', gap:5, fontSize:13, fontWeight:500, color:'#374151' },
  input: { marginTop:2, padding:'9px 11px', border:'1.5px solid #e5e7eb', borderRadius:8, fontSize:14, fontFamily:'inherit', outline:'none' },
  ta: { resize:'vertical' },
  modalBtns: { display:'flex', justifyContent:'flex-end', gap:10, marginTop:20 },
  cancelBtn: { padding:'9px 20px', border:'1px solid #e5e7eb', borderRadius:9, background:'white', fontSize:14, cursor:'pointer' },
  saveBtn: { padding:'9px 20px', background:'#7c3aed', color:'white', border:'none', borderRadius:9, fontSize:14, fontWeight:600, cursor:'pointer' },
}
