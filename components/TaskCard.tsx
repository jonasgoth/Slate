'use client';

import { useState } from 'react';
import { CardShell } from './CardShell';
import { Checkbox } from './Checkbox';
import { EditableText } from './EditableText';
import { DeleteButton } from './DeleteButton';

interface TaskCardProps {
  id: string;
  title: string;
  isCompleted: boolean;
  onToggle: (id: string, completed: boolean) => void;
  onUpdate: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  showMoveToToday?: boolean;
  onMoveToToday?: (id: string) => void;
  showMoveToBacklog?: boolean;
  onMoveToBacklog?: (id: string) => void;
  onEnter?: () => void;
}

export function TaskCard({
  id,
  title,
  isCompleted,
  onToggle,
  onUpdate,
  onDelete,
  showMoveToToday = false,
  onMoveToToday,
  showMoveToBacklog = false,
  onMoveToBacklog,
  onEnter,
}: TaskCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <CardShell onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Checkbox checked={isCompleted} onChange={(checked) => onToggle(id, checked)} />
      <div className="relative flex-1 min-w-0">
        <EditableText
          value={title}
          onSave={(newTitle) => onUpdate(id, newTitle)}
          completed={isCompleted}
          onEnter={onEnter}
        />
        <div
          className="absolute top-0 right-0 bottom-0 flex items-center gap-1.5"
          style={{
            paddingLeft: '40px',
            background: 'linear-gradient(to right, transparent, var(--bg-card) 40px)',
            opacity: hovered ? 1 : 0,
            pointerEvents: hovered ? 'auto' : 'none',
            transition: 'opacity 0.15s ease',
          }}
        >
          {showMoveToToday && (
            <button
              onClick={() => onMoveToToday?.(id)}
              className="hover-subtle"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-btn-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '22px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 500,
                padding: '0 8px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                transition: 'color 0.15s ease',
                cursor: 'pointer',
              }}
            >
              ← Today
            </button>
          )}
          {showMoveToBacklog && (
            <button
              onClick={() => onMoveToBacklog?.(id)}
              className="hover-subtle"
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-btn-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '22px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: 500,
                padding: '0 8px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                transition: 'color 0.15s ease',
                cursor: 'pointer',
              }}
            >
              → Backlog
            </button>
          )}
          <DeleteButton onClick={() => onDelete(id)} />
        </div>
      </div>
    </CardShell>
  );
}
