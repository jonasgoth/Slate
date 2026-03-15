'use client';

import { useState } from 'react';
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

  const showDelete = hovered;
  const showMoveBtn = hovered && showMoveToToday;
  const showMoveBacklogBtn = hovered && showMoveToBacklog;

  return (
    <div
      className="flex items-center gap-3"
      style={{
        borderRadius: '8px',
        border: '1px solid #E9E7E7',
        background: '#FFF',
        boxShadow: '0 1px 4px 0 rgba(37, 9, 18, 0.05)',
        padding: '15px 18px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Checkbox checked={isCompleted} onChange={(checked) => onToggle(id, checked)} />
      <EditableText
        value={title}
        onSave={(newTitle) => onUpdate(id, newTitle)}
        completed={isCompleted}
        onEnter={onEnter}
      />
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
        {showMoveToToday && (
          <button
            onClick={() => onMoveToToday?.(id)}
            className="text-xs transition-colors"
            style={{
              color: '#B5B5B0',
              fontSize: '13px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              transitionDuration: '0.15s',
              visibility: showMoveBtn ? 'visible' : 'hidden',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            → Today
          </button>
        )}
        {showMoveToBacklog && (
          <button
            onClick={() => onMoveToBacklog?.(id)}
            className="text-xs transition-colors"
            style={{
              color: '#B5B5B0',
              fontSize: '13px',
              fontWeight: 500,
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              transitionDuration: '0.15s',
              visibility: showMoveBacklogBtn ? 'visible' : 'hidden',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            ← Backlog
          </button>
        )}
        <div style={{ visibility: showDelete ? 'visible' : 'hidden' }}>
          <DeleteButton onClick={() => onDelete(id)} />
        </div>
      </div>
    </div>
  );
}
