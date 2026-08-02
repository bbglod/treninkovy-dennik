'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'
import styles from './page.module.css'

export default function PrihlaseniPage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')
  const router = useRouter()

  async function prihlasit() {
    const { error } = await supabase.auth.signInWithPassword({ email, password: heslo })
    if (error) setZprava('Chyba: ' + error.message)
    else router.push('/treninky')
  }

  return (
    <div className={styles.background}>
      <div className={styles.card_reg}>
        <h1 className={styles.title}>Přihlášení</h1>
        <p className={styles.subtitle}>Zadej své přihlašovací údaje.</p>
        <div className={styles.input}>
          <input
            className={styles.field}
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={styles.field}
            type="password"
            placeholder="Heslo"
            value={heslo}
            onChange={(e) => setHeslo(e.target.value)}
          />
          <button className={styles.btnPrimary} onClick={prihlasit}>
            Přihlásit se
          </button>
          {zprava && <p className={styles.error}>{zprava}</p>}
        </div>
      </div>
    </div>
  )
}