'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useMode } from '@/lib/ModeContext';

const TRACK_W = 30;
const TRACK_H = 17;
const THUMB = 13;
const PAD = 2;
const TRAVEL = TRACK_W - THUMB - PAD * 2;

const COLOR_PERSONAL = '#22c55e';
const COLOR_WORK = '#FF4652';

export function WorkModeToggle() {
  const { isWorkMode, toggleMode } = useMode();

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
    <motion.button
      onClick={toggleMode}
      role="switch"
      aria-checked={isWorkMode}
      aria-label={isWorkMode ? 'Switch to personal mode' : 'Switch to work mode'}
      animate={{ backgroundColor: isWorkMode ? COLOR_WORK : COLOR_PERSONAL }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: `${TRACK_W}px`,
        height: `${TRACK_H}px`,
        borderRadius: `${TRACK_H}px`,
        padding: `${PAD}px`,
        cursor: 'pointer',
        flexShrink: 0,
        outline: 'none',
        border: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <motion.span
        animate={{ x: isWorkMode ? TRAVEL : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 38, mass: 0.8 }}
        style={{
          display: 'block',
          width: `${THUMB}px`,
          height: `${THUMB}px`,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.22)',
          flexShrink: 0,
        }}
      />
    </motion.button>
    <AnimatePresence>
      {isWorkMode && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            letterSpacing: '0.01em',
            userSelect: 'none',
          }}
        >
          work mode
        </motion.span>
      )}
    </AnimatePresence>
    </div>
  );
}
