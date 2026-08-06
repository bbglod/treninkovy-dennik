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
  const [editSerie, setEditSerie] = useState(null)

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
  async function smazatSerii(serieId) {
  await supabase.from('serie').delete().eq('id', serieId)
  nacistDetail()
}
async function upravitSerii(serieId, novaVaha, novaOpakovani) {
  if (!novaVaha || novaVaha <= 0) return
  if (!novaOpakovani || novaOpakovani <= 0) return
  await supabase.from('serie').update({
    vaha: Number(novaVaha),
    opakovani: Number(novaOpakovani)
  }).eq('id', serieId)
  setEditSerie(null)
  nacistDetail()
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
    {editSerie?.id === s.id ? (
      <>
        <input
          type="number"
          defaultValue={s.vaha}
          id={`vaha-${s.id}`}
          style={{ width: '80px', marginRight: '0.5rem', padding: '0.25rem', borderRadius: '8px', background: '#1f2937', color: 'white', border: 'none' }}
        />
        <input
          type="number"
          defaultValue={s.opakovani}
          id={`op-${s.id}`}
          style={{ width: '80px', marginRight: '0.5rem', padding: '0.25rem', borderRadius: '8px', background: '#1f2937', color: 'white', border: 'none' }}
        />
        <button
          onClick={() => upravitSerii(s.id, document.getElementById(`vaha-${s.id}`).value, document.getElementById(`op-${s.id}`).value)}
          style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem' }}
        >
          Uložit
        </button>
        <button
          onClick={() => setEditSerie(null)}
          style={{ background: '#1f2937', color: '#d1d5db', border: 'none', borderRadius: '8px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Zrušit
        </button>
      </>
    ) : (
      <>
        <p>{s.vaha} kg × {s.opakovani} opakování</p>
        <button
          onClick={() => setEditSerie(s)}
          style={{ marginTop: '0.5rem', marginRight: '0.5rem', background: '#1f2937', color: '#d1d5db', border: 'none', borderRadius: '8px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Upravit
        </button>
        <button
          onClick={() => smazatSerii(s.id)}
          style={{ marginTop: '0.5rem', background: '#7f1d1d', color: '#fca5a5', border: 'none', borderRadius: '8px', padding: '0.25rem 0.75rem', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Smazat
        </button>
      </>
    )}
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