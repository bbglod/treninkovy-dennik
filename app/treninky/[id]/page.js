'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import styles from './page.module.css'

export default function TreninkDetailPage({ params }) {
  const [trenink, setTrenink] = useState(null)
  const [serie, setSerie] = useState([])
  const router = useRouter()
  const { id } = use(params)

  useEffect(() => {
    nacistDetail()
  }, [])

  async function nacistDetail() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/prihlaseni'); return }
    const { data: treninkData } = await supabase
      .from('treninky')
      .select('*')
      .eq('id', id)
      .single()
    setTrenink(treninkData)
    const { data: serieData } = await supabase
      .from('serie')
      .select('*, cviky(nazev)')
      .eq('trenink_id', id)
    setSerie(serieData || [])
    setSerie(serieData || [])
  }

  async function smazatTrenink() {
    await supabase.from('treninky').delete().eq('id', id)
    router.push('/treninky')
  }

  if (!trenink) return <p style={{ padding: '2rem' }}>Načítám...</p>

return (
  <div className={styles.background}>
    <button className={styles.button} onClick={() => router.push('/treninky')}>← Zpět</button>
    <h1 className={styles.title}>Trénink {trenink.datum}</h1>
    {trenink.poznamka && <p className={styles.note}>{trenink.poznamka}</p>}
    <h2>Série</h2>
    <p className={styles.note}>Celkem: {serie.reduce((sum, s) => sum + s.vaha * s.opakovani, 0)} kg</p>
    {serie.length === 0 && <p className={styles.empty}>Zatím žádné série.</p>}
    <div className={styles.serie}>
      {serie.map((s) => (
        <div key={s.id} className={styles.serieCard}>
          <p className={styles.serieText}>{s.cviky?.nazev}</p>
          <p>{s.vaha} kg × {s.opakovani} opakování</p>
        </div>
      ))}
    </div>
    {serie.length > 0 && (
      <div style={{ marginTop: '1rem' }}>
        <h3>Osobní rekordy</h3>
        {Object.entries(
          serie.reduce((acc, s) => {
            const nazev = s.cviky?.nazev || 'Neznámý cvik'
            if (!acc[nazev] || s.vaha > acc[nazev]) acc[nazev] = s.vaha
            return acc
          }, {})
        ).map(([nazev, maxVaha]) => (
          <p key={nazev}>{nazev}: {maxVaha} kg</p>
        ))}
      </div>
    )}
    <div className={styles.actions}>
      <button className={styles.btnPrimary} onClick={() => router.push(`/treninky/${id}/novaserie`)}>
        + Nová série
      </button>
      <button className={styles.btnDanger} onClick={smazatTrenink}>
        Smazat trénink
      </button>
    </div>
  </div>
)}