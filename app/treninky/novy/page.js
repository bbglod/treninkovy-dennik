'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'
import styles from './page.module.css'

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
    <div className={styles.background}>
      <button className={styles.btnBack} onClick={() => router.push('/treninky')}>← Zpět</button>
      <h1 className={styles.title}>Nový trénink</h1>
      <div className={styles.form}>
        <input className={styles.input} type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
        <input className={styles.input} placeholder="Poznámka (nepovinné)" value={poznamka} onChange={(e) => setPoznamka(e.target.value)} />
        <button className={styles.btnPrimary} onClick={ulozit}>Uložit</button>
        {zprava && <p className={styles.error}>{zprava}</p>}
      </div>
    </div>
  )

}