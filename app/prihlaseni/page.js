'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function PrihlaseniPage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')
  const router = useRouter()

  async function prihlasit() {
    const { error } = await supabase.auth.signInWithPassword({ email, password: heslo })
    if (error) setZprava('Chyba: ' + error.message)
    else router.push('/treninky')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Přihlášení</h1>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Heslo" value={heslo} onChange={(e) => setHeslo(e.target.value)} />
      <button onClick={prihlasit}>Přihlásit se</button>
      <p>{zprava}</p>
    </div>
  )
}