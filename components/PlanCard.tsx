'use client';

import { useState, useRef, useEffect } from 'react';
import { differenceInCalendarDays, format, parseISO } from 'date-fns';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { EditableText } from './EditableText';
import { DeleteButton } from './DeleteButton';
import type { Plan } from '@/types';

interface PlanCardProps {
  plan: Plan;
  onUpdate: (id: string, updates: Partial<Plan>) => void;
  onDelete: (id: string) => void;
  readonly?: boolean;
  onEnter?: () => void;
}

function getDaysUntil(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const planDate = parseISO(dateStr);
  const diff = differenceInCalendarDays(planDate, today);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  return `${diff} days`;
}

export function PlanCard({ plan, onUpdate, onDelete, readonly = false, onEnter }: PlanCardProps) {
  const [hovered, setHovered] = useState(false);
  const [dateHovered, setDateHovered] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const emoji = plan.emoji
    || (typeof window !== 'undefined' ? localStorage.getItem(`plan-emoji-${plan.id}`) : null)
    || '😊';

  useEffect(() => {
    if (!pickerOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [pickerOpen]);

  const handleEmojiSelect = (newEmoji: string) => {
    onUpdate(plan.id, { emoji: newEmoji });
    setPickerOpen(false);
  };

  const daysUntil = plan.date ? getDaysUntil(plan.date) : '';
  const fullDate = plan.date ? format(parseISO(plan.date), 'MMMM d') : '';

  const handleDateClick = () => {
    if (readonly) return;
    setEditingDate(true);
    setDateHovered(false);
    setTimeout(() => dateInputRef.current?.showPicker?.(), 0);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onUpdate(plan.id, { date: e.target.value });
    }
    setEditingDate(false);
  };

  const handleDateBlur = () => {
    setEditingDate(false);
  };

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
      {/* Emoji button + picker */}
      <div ref={pickerRef} className="relative flex-shrink-0">
        <button
          onClick={() => { if (!readonly) setPickerOpen((o) => !o); }}
          style={{
            fontSize: '16px',
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: readonly ? 'default' : 'pointer',
            lineHeight: 1,
          }}
          title={readonly ? undefined : 'Change emoji'}
        >
          {emoji}
        </button>
        {pickerOpen && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 50 }}>
            <Picker
              data={data}
              onEmojiSelect={(e: { native: string }) => handleEmojiSelect(e.native)}
              autoFocus
              theme="light"
              previewPosition="none"
              skinTonePosition="none"
            />
          </div>
        )}
      </div>

      <EditableText
        value={plan.title}
        onSave={(title) => onUpdate(plan.id, { title })}
        completed={false}
        onEditingChange={setEditing}
        onEnter={onEnter}
      />
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Delete button slides in from left, pushing date right */}
        <div
          className="overflow-hidden flex items-center"
          style={{
            width: hovered && !readonly && !editing ? '26px' : '0px',
            opacity: hovered && !readonly && !editing ? 1 : 0,
            transition: 'width 0.2s ease, opacity 0.2s ease',
          }}
        >
          <DeleteButton onClick={() => onDelete(plan.id)} />
        </div>

        {/* Date badge / editable date input */}
        {editingDate ? (
          <input
            ref={dateInputRef}
            type="date"
            defaultValue={plan.date ?? ''}
            onChange={handleDateChange}
            onBlur={handleDateBlur}
            autoFocus
            className="outline-none bg-transparent flex-shrink-0"
            style={{
              fontSize: '13px',
              color: '#B5B5B0',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontWeight: 400,
              border: 'none',
              width: '130px',
              textAlign: 'right',
            }}
          />
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setDateHovered(true)}
            onMouseLeave={() => setDateHovered(false)}
            onClick={handleDateClick}
            style={{ cursor: readonly ? 'default' : 'pointer' }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 400,
                color: hovered && !readonly ? '#8C8C87' : '#B5B5B0',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
            >
              {daysUntil}
            </span>
            {dateHovered && fullDate && !readonly && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#1A1A1A',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 500,
                  borderRadius: '20px',
                  zIndex: 10,
                  padding: '4px 10px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                }}
              >
                {fullDate}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
