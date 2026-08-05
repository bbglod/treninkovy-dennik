'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabaseClient'
import styles from './page.module.css'

export default function NovaSeriePage({ params }) {
  const { id } = use(params)
  const [cviky, setCviky] = useState([])
  const [cvikId, setCvikId] = useState('')
  const [vaha, setVaha] = useState('')
  const [opakovani, setOpakovani] = useState('')
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

  async function ulozitSerii() {
    if (!cvikId) { setZprava('Vyber cvik.'); return }
    if (!vaha || vaha <= 0) { setZprava('Váha musí být větší než 0.'); return }
    if (!opakovani || opakovani <= 0 || !Number.isInteger(Number(opakovani))) {
      setZprava('Opakování musí být celé číslo větší než 0.'); return
    }
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('serie').insert({
      trenink_id: id,
      cvik_id: cvikId,
      vaha: Number(vaha),
      opakovani: Number(opakovani),
      user_id: user.id
    })
    if (error) setZprava('Chyba: ' + error.message)
    else router.push(`/treninky/${id}`)
  }

  return (
    <div className={styles.background}>
      <button className={styles.btnBack} onClick={() => router.push(`/treninky/${id}`)}>← Zpět</button>
      <h1 className={styles.title}>Nová série</h1>
      <div className={styles.listcviky}>
        <select className={styles.select} value={cvikId} onChange={(e) => setCvikId(e.target.value)}>
          <option value="">Vyber cvik...</option>
          {cviky.map((c) => (
            <option key={c.id} value={c.id}>{c.nazev}</option>
          ))}
        </select>
        <input className={styles.input} type="number" placeholder="Váha (kg)" value={vaha} onChange={(e) => setVaha(e.target.value)} />
        <input className={styles.input} type="number" placeholder="Opakování" value={opakovani} onChange={(e) => setOpakovani(e.target.value)} />
        <button className={styles.btnPrimary} onClick={ulozitSerii}>Uložit sérii</button>
        {zprava && <p className={styles.error}>{zprava}</p>}
      </div>
    </div>
  )
}