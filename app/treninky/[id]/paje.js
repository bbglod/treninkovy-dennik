'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function TreninkDetailPage({ params }) {
  const [trenink, setTrenink] = useState(null)
  const [serie, setSerie] = useState([])
  const router = useRouter()

  useEffect(() => {
    nacistDetail()
  }, [])

  async function nacistDetail() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/prihlaseni'); return }
    const { data: treninkData } = await supabase
      .from('treninky')
      .select('*')
      .eq('id', params.id)
      .single()
    setTrenink(treninkData)
    const { data: serieData } = await supabase
      .from('serie')
      .select('*, cviky(nazev)')
      .eq('trenink_id', params.id)
    setSerie(serieData || [])
  }

  async function smazatTrenink() {
    await supabase.from('treninky').delete().eq('id', params.id)
    router.push('/treninky')
  }

  if (!trenink) return <p style={{ padding: '2rem' }}>Načítám...</p>

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={() => router.push('/treninky')}>← Zpět</button>
      <h1>Trénink {trenink.datum}</h1>
      {trenink.poznamka && <p>{trenink.poznamka}</p>}
      <h2>Série</h2>
      {serie.length === 0 && <p>Zatím žádné série.</p>}
      {serie.map((s) => (
        <div key={s.id}>
          <p>{s.cviky?.nazev} — {s.vaha} kg × {s.opakovani} opakování</p>
        </div>
      ))}
      <button onClick={smazatTrenink} style={{ color: 'red', marginTop: '1rem' }}>
        Smazat trénink
      </button>
    </div>
  )
}