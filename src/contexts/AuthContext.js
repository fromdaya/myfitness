import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profileError, setProfileError] = useState(null)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    setProfileError(null)
    try {
      // Retry up to 3 times — profile row may not exist yet right after signup
      let data = null
      let error = null
      for (let i = 0; i < 3; i++) {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        data = result.data
        error = result.error
        if (data) break
        // Wait 1s and retry (trigger may be slightly delayed)
        await new Promise(r => setTimeout(r, 1000))
      }
      if (error && !data) {
        console.error('Profile fetch error:', error)
        setProfileError(error.message)
      }
      setProfile(data || null)
    } catch (e) {
      console.error('Profile exception:', e)
      setProfileError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(email, password, fullName, role = 'client') {
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role } }
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
    setUser(null)
  }

  async function refreshProfile() {
    if (user) await fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={{ user, profile, profileError, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
