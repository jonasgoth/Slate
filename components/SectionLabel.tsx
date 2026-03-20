'use client';

import { useState } from 'react';

interface SectionLabelProps {
  children: React.ReactNode;
  collapsible?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function SectionLabel({ children, collapsible, isOpen, onToggle }: SectionLabelProps) {
  const [hovered, setHovered] = useState(false);

  if (!collapsible) {
    return (
      <p
        style={{
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--text-muted)',
          marginBottom: '12px',
        }}
      >
        {children}
      </p>
    );
  }

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        marginBottom: '12px',
        color: hovered ? 'var(--text-btn-hover)' : 'var(--text-muted)',
        transition: 'color 0.15s ease',
      }}
    >
      <span style={{ fontSize: '14px', fontWeight: 500 }}>{children}</span>
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
          transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          color: 'inherit',
          flexShrink: 0,
        }}
      >
        <path
          d="M2.5 4.5L6 8L9.5 4.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
