'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './page.module.css'

export default function CvikyPage() {
  const [cviky, setCviky] = useState([])
  const [novyCvik, setNovyCvik] = useState('')
  const [zprava, setZprava] = useState('')
  const router = useRouter()
  const [editCvik, setEditCvik] = useState(null)
const [novyNazev, setNovyNazev] = useState('')

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
  async function upravitCvik(id) {
  if (!novyNazev.trim()) return
  await supabase.from('cviky').update({ nazev: novyNazev.trim() }).eq('id', id)
  setEditCvik(null)
  setNovyNazev('')
  nacistCviky()
}

  return (
  <div className={styles.background}>
    <button className={styles.btnBack} onClick={() => router.push('/treninky')}>← Zpět</button>
    <h1 className={styles.title}>Moje cviky</h1>
    <div className={styles.add}>
      <input
        className={styles.input}
        placeholder="Název cviku"
        value={novyCvik}
        onChange={(e) => setNovyCvik(e.target.value)}
      />
      <button className={styles.btnPrimary} onClick={pridatCvik}>Přidat</button>
    </div>
    {zprava && <p className={styles.error}>{zprava}</p>}
    {cviky.length === 0 && <p className={styles.empty}>Zatím žádné cviky.</p>}
    <div className={styles.cviky_grid}>
     {cviky.map((c) => (
  <div key={c.id} className={styles.delete}>
    {editCvik === c.id ? (
      <>
        <input
          className={styles.input}
          value={novyNazev}
          onChange={(e) => setNovyNazev(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <button className={styles.btnPrimary} onClick={() => upravitCvik(c.id)}>Uložit</button>
        <button className={styles.btnDanger} onClick={() => setEditCvik(null)}>Zrušit</button>
      </>
    ) : (
      <>
        <p className={styles.cvik} onClick={() => router.push(`/cviky/${c.id}`)} style={{ cursor: 'pointer' }}>
  {c.nazev}
</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className={styles.btnDanger} onClick={() => { setEditCvik(c.id); setNovyNazev(c.nazev) }}>Upravit</button>
          <button className={styles.btnDanger} onClick={() => smazatCvik(c.id)}>Smazat</button>
        </div>
      </>
    )}
  </div>
))}
    </div>
  </div>
)
}