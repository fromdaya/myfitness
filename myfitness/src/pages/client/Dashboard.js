import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function ClientDashboard() {
  const { profile } = useAuth()
  const [assignment, setAssignment] = useState(null)
  const [dayData, setDayData] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadTodayWorkout = useCallback(async () => {
    if (!profile) return
    const { data: cp } = await supabase
      .from('client_programs')
      .select('*, program:programs(*)')
      .eq('client_id', profile.id)
      .eq('is_active', true)
      .single()

    if (!cp) { setLoading(false); return }
    setAssignment(cp)

    const { data: day } = await supabase
      .from('program_days')
      .select('*, exercises:program_day_exercises(*, exercise:exercises(*))')
      .eq('program_id', cp.program_id)
      .eq('day_number', cp.current_day)
      .single()

    setDayData(day)
    setLoading(false)
  }, [profile])

  useEffect(() => {
    loadTodayWorkout()
  }, [loadTodayWorkout])

  if (loading) return <div style={s.loading}>Loading your workout...</div>

  return (
    <div>
      <h1 style={s.h1}>Hey {profile?.full_name?.split(' ')[0]}! 🎯</h1>

      {!assignment ? (
        <div style={s.empty}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏋️</div>
          <h3 style={{ marginBottom: 8 }}>No program assigned yet</h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Your coach will assign a program to get you started.</p>
        </div>
      ) : (
        <>
          <div style={s.dayCard}>
            <div style={s.dayNum}>Day {assignment.current_day}</div>
            <div style={s.programName}>{assignment.program?.title}</div>
            <div style={s.progress}>
              <div style={s.progressBar}>
                <div style={{ ...s.progressFill, width: (assignment.current_day / assignment.program?.duration_days * 100) + '%' }} />
              </div>
              <span style={s.progressLabel}>{assignment.current_day} / {assignment.program?.duration_days} days</span>
            </div>
          </div>

          {dayData?.is_rest ? (
            <div style={s.restCard}>
              <div style={{ fontSize: 48 }}>🌟</div>
              <h2>Rest Day</h2>
              <p>Let your muscles recover and grow stronger.</p>
            </div>
          ) : dayData ? (
            <div>
              <h2 style={s.h2}>Today's Workout</h2>
              {dayData.focus && <p style={s.focus}>{dayData.focus}</p>}
              <div style={s.exList}>
                {dayData.exercises?.map((item) => (
                  <div key={item.id} style={s.exCard}>
                    <div style={s.exName}>{item.exercise?.name || 'Exercise'}</div>
                    <div style={s.exDetail}>
                      {item.sets && <span style={s.tag}>{item.sets} sets</span>}
                      {item.reps && <span style={s.tag}>{item.reps}</span>}
                      {item.rest_seconds && <span style={s.tagBlue}>⏱ {item.rest_seconds}s rest</span>}
                    </div>
                    {item.notes && <div style={s.exNote}>💡 {item.notes}</div>}
                  </div>
                ))}
              </div>
              <button style={s.logBtn}>✓ Log Today's Workout</button>
            </div>
          ) : <div style={s.empty}>No workout data for today.</div>}
        </>
      )}
    </div>
  )
}

const s = {
  h1: { fontSize: 26, fontWeight: 800, marginBottom: 20 },
  h2: { fontSize: 18, fontWeight: 700, marginBottom: 12 },
  loading: { textAlign: 'center', padding: '4rem', color: '#9ca3af' },
  empty: { background: 'white', borderRadius: 16, padding: '3rem 2rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  dayCard: { background: 'linear-gradient(135deg, #1a56db, #0e9f6e)', borderRadius: 16, padding: '1.5rem', color: 'white', marginBottom: 24 },
  dayNum: { fontSize: 42, fontWeight: 800, lineHeight: 1 },
  programName: { fontSize: 16, opacity: 0.85, marginTop: 4, marginBottom: 16 },
  progress: { display: 'flex', alignItems: 'center', gap: 10 },
  progressBar: { flex: 1, height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3 },
  progressFill: { height: '100%', background: 'white', borderRadius: 3, transition: 'width .3s' },
  progressLabel: { fontSize: 13, opacity: 0.85, whiteSpace: 'nowrap' },
  restCard: { background: 'white', borderRadius: 16, padding: '3rem', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 },
  focus: { color: '#059669', background: '#ecfdf5', padding: '8px 14px', borderRadius: 8, fontSize: 14, marginBottom: 16 },
  exList: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 },
  exCard: { background: 'white', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  exName: { fontWeight: 600, marginBottom: 8 },
  exDetail: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  tag: { background: '#f3f4f6', color: '#374151', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500 },
  tagBlue: { background: '#eff6ff', color: '#1d4ed8', fontSize: 12, padding: '3px 10px', borderRadius: 20, fontWeight: 500 },
  exNote: { marginTop: 8, fontSize: 12, color: '#6b7280' },
  logBtn: { width: '100%', padding: '14px', background: '#0e9f6e', color: 'white', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700 }
}
