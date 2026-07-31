'use client'


import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './page.module.css'

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
  <div className={styles.background}>
    <div className={styles.header}>
      <h1 className={styles.title}>Moje tréninky</h1>
      <div className={styles.buttons}>
        <button className={styles.btnSecondary} onClick={() => router.push('/cviky')}>
          Cviky
        </button>
        <button className={styles.btnPrimary} onClick={() => router.push('/treninky/novy')}>
          + Nový
        </button>
      </div>
    </div>
    {treninky.length === 0 && <p className={styles.empty}>Zatím žádné tréninky.</p>}
    <div className={styles.list}>
      {treninky.map((t) => (
        <div key={t.id} className={styles.card} onClick={() => router.push(`/treninky/${t.id}`)}>
          <p className={styles.cardDate}>{t.datum}</p>
          {t.poznamka && <p className={styles.cardNote}>{t.poznamka}</p>}
        </div>
      ))}
    </div>
  </div>
)
}