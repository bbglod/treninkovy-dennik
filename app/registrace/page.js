'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import styles from './page.module.css'

export default function RegistracePage() {
  const [email, setEmail] = useState('')
  const [heslo, setHeslo] = useState('')
  const [zprava, setZprava] = useState('')

  async function registrovat() {
    const { error } = await supabase.auth.signUp({ email, password: heslo })
    if (error) setZprava('Chyba: ' + error.message)
    else setZprava('Účet vytvořen! Zkontroluj e-mail.')
  }

  return (
    <div className={styles.background}>
      <div className={styles.card_reg}>
        <h1 className={styles.title}>Registrace</h1>
        <p className={styles.subtitle}>Vyplň formulář a vytvoř účet.</p>
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
          <button className={styles.btnPrimary} onClick={registrovat}>
            Zaregistrovat
          </button>
          {zprava && (
            <p className={zprava.includes('Chyba') ? styles.error : styles.zprava}>
              {zprava}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}