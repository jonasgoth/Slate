'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface BrainDumpProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string) => Promise<void>;
}

export function BrainDump({ isOpen, onClose, onAdd }: BrainDumpProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => textareaRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setText('');
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/parse-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) throw new Error('Request failed');

      const { tasks } = await res.json() as { tasks: string[] };
      await Promise.all(tasks.map((t) => onAdd(t)));
      setText('');
      onClose();
    } catch {
      setError('Could not parse — try again');
    } finally {
      setLoading(false);
    }
  }, [text, loading, onAdd, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="brain-dump-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              zIndex: 200,
            }}
          />

          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 201,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              key="brain-dump-modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 32,
                opacity: { duration: 0.18 },
              }}
              style={{
                pointerEvents: 'auto',
                width: 'min(520px, calc(100vw - 48px))',
              }}
            >
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '14px',
                  padding: '22px',
                  boxShadow: '0 32px 80px rgba(0, 0, 0, 0.28)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Brain Dump
                </div>

                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  disabled={loading}
                  placeholder="e.g. call dentist, finish the report, buy groceries, book flights for May..."
                  rows={6}
                  style={{
                    width: '100%',
                    resize: 'vertical',
                    borderRadius: '8px',
                    border: '1px solid var(--border-card)',
                    background: 'var(--bg-app)',
                    padding: '13px 16px',
                    fontSize: '14px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    lineHeight: 1.55,
                    outline: 'none',
                    opacity: loading ? 0.5 : 1,
                    transition: 'opacity 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {error ? (
                    <span style={{ fontSize: '13px', color: '#D4736C' }}>{error}</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {loading ? 'Parsing...' : '↵ to add · Esc to cancel'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
