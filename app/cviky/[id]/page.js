'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import styles from './page.module.css'

export default function CvikDetailPage({ params }) {
  const { id } = use(params)
  const [cvik, setCvik] = useState(null)
  const [historie, setHistorie] = useState([])
  const router = useRouter()

  useEffect(() => {
    nacistDetail()
  }, [])

  async function nacistDetail() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/prihlaseni'); return }

    const { data: cvikData } = await supabase
      .from('cviky').select('*').eq('id', id).single()
    setCvik(cvikData)

    const { data: serieData } = await supabase
      .from('serie')
      .select('*, treninky(datum)')
      .eq('cvik_id', id)
      .order('id', { ascending: false })
    setHistorie(serieData || [])
  }

  const maxVaha = historie.length > 0 ? Math.max(...historie.map(s => s.vaha)) : 0

  if (!cvik) return <p style={{ padding: '2rem' }}>Načítám...</p>

  return (
    <div className={styles.background}>
      <button className={styles.btnBack} onClick={() => router.push('/cviky')}>← Zpět</button>
      <h1 className={styles.title}>{cvik.nazev}</h1>
      <p className={styles.pr}>Osobní rekord: {maxVaha} kg</p>
      <h2>Historie</h2>
      {historie.length === 0 && <p className={styles.empty}>Zatím žádné záznamy.</p>}
      <div className={styles.list}>
        {historie.map((s) => (
          <div key={s.id} className={styles.card}>
            <p className={styles.datum}>{s.treninky?.datum}</p>
            <p>{s.vaha} kg × {s.opakovani} opakování</p>
          </div>
        ))}
      </div>
    </div>
  )
}