'use client'

import { useState } from 'react'

export default function RegistracePage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')

  async function registrovat() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

    if (!supabaseUrl || !supabaseKey) {
      setZprava('Chybí proměnné Supabase. Přidej NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY do .env.local.')
      return
    }

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { error } = await supabase.auth.signUp({ email, password: heslo })
      if (error) setZprava('Chyba: ' + error.message)
      else setZprava('Účet vytvořen! Zkontroluj e-mail.')
    } catch (error) {
      setZprava('Nepodařilo se načíst Supabase klienta: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Registrace</h1>
      <p>Vyplň formulář a zkus registraci.</p>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Heslo" value={heslo} onChange={(e) => setHeslo(e.target.value)} />
      <button onClick={registrovat}>Zaregistrovat</button>
      <p>{zprava}</p>
    </div>
  )
}