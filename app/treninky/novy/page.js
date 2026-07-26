'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function NovyTreninkPage() {
  const [datum, setDatum] = useState(new Date().toISOString().split('T')[0])
  const [poznamka, setPoznamka] = useState('')
  const [zprava, setZprava] = useState('')
  const router = useRouter()

  async function ulozit() {
    if (!datum) { setZprava('Datum je povinné.'); return }
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('treninky').insert({ datum, poznamka, user_id: user.id })
    if (error) setZprava('Chyba: ' + error.message)
    else router.push('/treninky')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Nový trénink</h1>
      <input type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
      <input placeholder="Poznámka (nepovinné)" value={poznamka} onChange={(e) => setPoznamka(e.target.value)} />
      <button onClick={ulozit}>Uložit</button>
      <p>{zprava}</p>
    </div>
  )
}