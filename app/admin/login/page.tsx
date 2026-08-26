'use client';

import { useState } from 'react';
import { login } from '../actions';
import CryptoJS from 'crypto-js';
import styles from './login.module.css';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    
    const key = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'wheelo-login-secret-key-123';
    const encryptedUsername = CryptoJS.AES.encrypt(formData.get('username') as string, key).toString();
    const encryptedPassword = CryptoJS.AES.encrypt(formData.get('password') as string, key).toString();
    
    formData.set('username', encryptedUsername);
    formData.set('password', encryptedPassword);

    const res = await login(formData);
    if (res?.error) {
      setError(res.error);
      setPending(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h2>Admin Login</h2>
        <form action={handleSubmit} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" required />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" required />
          </div>
          <button type="submit" disabled={pending} className={styles.submitBtn}>
            {pending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
