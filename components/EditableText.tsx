'use client';

import { useState, useRef, useEffect } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  completed?: boolean;
  onEditingChange?: (editing: boolean) => void;
  onEnter?: () => void;
}

export function EditableText({ value, onSave, completed = false, onEditingChange, onEnter }: EditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const clickXRef = useRef<number | null>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();

      // Place caret at the click position rather than selecting all text
      const x = clickXRef.current;
      if (x !== null) {
        const input = inputRef.current;
        const style = window.getComputedStyle(input);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          const inputLeft = input.getBoundingClientRect().left;
          const relX = x - inputLeft;
          let offset = input.value.length;
          for (let i = 0; i <= input.value.length; i++) {
            const w = ctx.measureText(input.value.slice(0, i)).width;
            if (w >= relX) {
              const wPrev = i > 0 ? ctx.measureText(input.value.slice(0, i - 1)).width : 0;
              offset = (relX - wPrev < w - relX) ? i - 1 : i;
              break;
            }
          }
          input.setSelectionRange(Math.max(0, offset), Math.max(0, offset));
        }
      }
      clickXRef.current = null;
    }
  }, [editing]);

  const commit = () => {
    setEditing(false);
    onEditingChange?.(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
    onEditingChange?.(false);
  };

  const textStyle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 400,
    lineHeight: '120%',
    color: 'var(--text-primary)',
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.45 : 1,
  };

  if (editing) {
    const sharedStyle: React.CSSProperties = {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: '120%',
      padding: '1px 4px',
      whiteSpace: 'pre',
    };
    return (
      <div className="flex-1 min-w-0">
        <span style={{ position: 'relative', display: 'inline-block', maxWidth: 'calc(100% + 8px)', margin: '-1px -4px' }}>
          {/* hidden mirror — drives the width of the container */}
          <span
            aria-hidden
            style={{ ...sharedStyle, visibility: 'hidden', display: 'block' }}
          >
            {draft || ' '}
          </span>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { commit(); onEnter?.(); }
              if (e.key === 'Escape') cancel();
            }}
            className="outline-none"
            style={{
              ...sharedStyle,
              position: 'absolute',
              inset: 0,
              width: '100%',
              color: 'var(--text-primary)',
              background: 'var(--bg-edit-active)',
              borderRadius: '4px',
            }}
          />
        </span>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 overflow-hidden">
      <span
        data-editable-text
        onClick={(e) => {
          clickXRef.current = e.clientX;
          setEditing(true);
          setDraft(value);
          onEditingChange?.(true);
        }}
        className="cursor-text"
        style={{ ...textStyle, display: 'inline' }}
      >
        {value}
      </span>
    </div>
  );
}
