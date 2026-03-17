'use client';

import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { EditableText } from './EditableText';
import { DeleteButton } from './DeleteButton';

interface RitualCardProps {
  id: string;
  title: string;
  isCompletedToday: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
}

export function RitualCard({ id, title, isCompletedToday, onToggle, onUpdate, onDelete }: RitualCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-3"
      style={{
        borderRadius: '8px',
        border: '1px solid var(--border-card)',
        background: 'var(--bg-card)',
        boxShadow: 'var(--shadow-card)',
        padding: '13px 16px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Checkbox checked={isCompletedToday} onChange={(checked) => onToggle(id, checked)} />
      <EditableText
        value={title}
        onSave={(newTitle) => onUpdate(id, newTitle)}
        completed={isCompletedToday}
      />
      <div style={{ visibility: hovered ? 'visible' : 'hidden', flexShrink: 0 }}>
        <DeleteButton onClick={() => onDelete(id)} />
      </div>
    </div>
  );
}
