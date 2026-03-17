'use client';

import { ReactNode } from 'react';

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  icon?: ReactNode;
  active?: boolean;
}

export function AddButton({ onClick, label = '+ Add', icon, active }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-sm hover-subtle transition-colors"
      style={{
        color: active ? 'var(--text-dark-muted)' : 'var(--text-muted)',
        fontWeight: 500,
        padding: '6px 10px',
        borderRadius: '8px',
        backgroundColor: 'transparent',
        transitionDuration: '0.15s',
        transitionTimingFunction: 'ease',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: icon ? '5px' : undefined,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
