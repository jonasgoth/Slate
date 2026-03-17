'use client';

import { useActionState } from 'react';
import { login } from './actions';

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <form action={formAction} style={{ width: '200px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          autoFocus
          autoComplete="current-password"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid var(--border-input)',
            borderRadius: '8px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        {state?.error && (
          <p style={{ fontSize: '12px', color: '#e05252', textAlign: 'center' }}>
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '14px',
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-app)',
            border: 'none',
            borderRadius: '8px',
            cursor: pending ? 'default' : 'pointer',
            opacity: pending ? 0.5 : 1,
          }}
        >
          {pending ? '...' : 'Enter'}
        </button>
      </form>
    </div>
  );
}
