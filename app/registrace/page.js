'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function RegistracePage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')

  async function registrovat() {
    const { error } = await supabase.auth.signUp({ email, password: heslo })
    if (error) setZprava('Chyba: ' + error.message)
    else setZprava('Účet vytvořen! Zkontroluj e-mail.')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Registrace</h1>
      <p>Vyplň formulář .</p>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Heslo" value={heslo} onChange={(e) => setHeslo(e.target.value)} />
      <button onClick={registrovat}>Zaregistrovat</button>
      <p>{zprava}</p>
    </div>
  )
}'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function RegistracePage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')

  async function registrovat() {
    const { error } = await supabase.auth.signUp({ email, password: heslo })
    if (error) setZprava('Chyba: ' + error.message)
    else setZprava('Účet vytvořen! Zkontroluj e-mail.')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Registrace</h1>
      <p>Vyplň formulář </p>
      <input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Heslo" value={heslo} onChange={(e) => setHeslo(e.target.value)} />
      <button onClick={registrovat}>Zaregistrovat</button>
      <p>{zprava}</p>
    </div>
  )
}