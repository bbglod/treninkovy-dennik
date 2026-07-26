'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function TreninkyPage() {
  const [treninky, setTreninky] = useState([])
  const router = useRouter()

  useEffect(() => {
    nacistTreninky()
  }, [])

  async function nacistTreninky() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/prihlaseni'); return }
    const { data } = await supabase.from('treninky').select('*').order('datum', { ascending: false })
    setTreninky(data || [])
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Moje tréninky</h1>
      <button onClick={() => router.push('/treninky/novy')}>+ Nový trénink</button>
      {treninky.length === 0 && <p>Zatím žádné tréninky.</p>}
      {treninky.map((t) => (
        <div key={t.id} onClick={() => router.push(`/treninky/${t.id}`)}>
          <p>{t.datum} {t.poznamka && `— ${t.poznamka}`}</p>
        </div>
      ))}
    </div>
  )
}