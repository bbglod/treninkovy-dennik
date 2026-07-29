'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function CvikyPage() {
  const [cviky, setCviky] = useState([])
  const [novyCvik, setNovyCvik] = useState('')
  const [zprava, setZprava] = useState('')
  const router = useRouter()

  useEffect(() => {
    nacistCviky()
  }, [])

  async function nacistCviky() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/prihlaseni'); return }
    const { data } = await supabase.from('cviky').select('*').order('nazev')
    setCviky(data || [])
  }

  async function pridatCvik() {
    if (!novyCvik.trim()) { setZprava('Název je povinný.'); return }
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('cviky').insert({ nazev: novyCvik.trim(), user_id: user.id })
    if (error) setZprava('Chyba: ' + error.message)
    else { setNovyCvik(''); setZprava(''); nacistCviky() }
  }

  async function smazatCvik(id) {
    await supabase.from('cviky').delete().eq('id', id)
    nacistCviky()
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.push('/treninky')}>← Zpět</button>
      <h1>Moje cviky</h1>
      <input
        placeholder="Název cviku"
        value={novyCvik}
        onChange={(e) => setNovyCvik(e.target.value)}
      />
      <button onClick={pridatCvik}>Přidat</button>
      <p>{zprava}</p>
      {cviky.length === 0 && <p>Zatím žádné cviky.</p>}
      {cviky.map((c) => (
        <div key={c.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p>{c.nazev}</p>
          <button onClick={() => smazatCvik(c.id)} style={{ color: 'red' }}>Smazat</button>
        </div>
      ))}
    </div>
  )
}