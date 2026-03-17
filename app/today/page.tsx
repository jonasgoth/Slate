'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useTodos } from '@/hooks/useTodos';
import { usePlans } from '@/hooks/usePlans';
import { useRituals } from '@/hooks/useRituals';
import { useData } from '@/lib/DataContext';
import { useMode } from '@/lib/ModeContext';
import { TaskCard } from '@/components/TaskCard';
import { PlanCard } from '@/components/PlanCard';
import { RitualCard } from '@/components/RitualCard';
import { BrainDump } from '@/components/BrainDump';
import { SectionLabel } from '@/components/SectionLabel';
import { AddButton } from '@/components/AddButton';
import { InlineAddTask } from '@/components/InlineAddTask';
import { SortableList } from '@/components/SortableList';
import { WorkModeToggle } from '@/components/WorkModeToggle';
import type { Todo } from '@/types';

const collapseVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.17, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.14, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
};

const modeListVariants = {
  enter: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.14, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit: { opacity: 0, y: -5, transition: { duration: 0.10, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
};

export default function TodayPage() {
  const { today } = useData();
  const { todos, addTodo, updateTodo, deleteTodo, reorderTodos, moveToBacklog } = useTodos();
  const { plans } = usePlans();
  const { rituals, addRitual, updateRitual, deleteRitual } = useRituals();
  const { mode } = useMode();

  const [addingTask, setAddingTask] = useState(false);
  const [brainDumpOpen, setBrainDumpOpen] = useState(false);
  const [addingRitual, setAddingRitual] = useState(false);
  const [focusOpen, setFocusOpen] = useState(true);
  const [ritualsOpen, setRitualsOpen] = useState(true);
  const [plansOpen, setPlansOpen] = useState(true);

  const dayName = format(new Date(), 'EEEE');
  const dateLabel = format(new Date(), 'MMMM d');

  const filteredTodos = todos.filter((t) => (t.mode ?? 'personal') === mode);
  const filteredRituals = rituals.filter((r) => (r.mode ?? 'personal') === mode);
  const upcomingPlans = plans.filter((p) => (p.mode ?? 'personal') === mode).slice(0, 3);

  return (
    <>
    <BrainDump
      isOpen={brainDumpOpen}
      onClose={() => setBrainDumpOpen(false)}
      onAdd={async (title) => { await addTodo(title, mode); }}
    />
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            color: 'var(--text-primary)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '26px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {dayName}
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
          <WorkModeToggle />
        </div>
      </div>

      {/* Focus section */}
      <div style={{ marginBottom: '32px' }}>
        <SectionLabel
          collapsible
          isOpen={focusOpen}
          onToggle={() => setFocusOpen((v) => !v)}
        >
          Focus
        </SectionLabel>
        <motion.div
          variants={collapseVariants}
          animate={focusOpen ? 'open' : 'closed'}
          initial={false}
          style={{ overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={modeListVariants}
              initial="enter"
              animate="visible"
              exit="exit"
            >
              <SortableList<Todo>
                items={filteredTodos}
                onReorder={reorderTodos}
                gap={8}
                renderItem={(todo) => (
                  <TaskCard
                    id={todo.id}
                    title={todo.title}
                    isCompleted={todo.is_completed}
                    onToggle={(id, completed) => updateTodo(id, { is_completed: completed })}
                    onUpdate={(id, title) => updateTodo(id, { title })}
                    onDelete={deleteTodo}
                    showMoveToBacklog={!todo.is_completed}
                    onMoveToBacklog={moveToBacklog}
                    onEnter={() => setAddingTask(true)}
                  />
                )}
              />

              {/* Inline add task */}
              {addingTask && (
                <div style={{ marginTop: '8px' }}>
                  <InlineAddTask
                    onAdd={async (title) => { await addTodo(title, mode); }}
                    onCancel={() => setAddingTask(false)}
                  />
                </div>
              )}

              {/* Action buttons row */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
                {!addingTask && (
                  <AddButton onClick={() => setAddingTask(true)} />
                )}
                <AddButton
                  onClick={() => {
                    setBrainDumpOpen((v) => !v);
                    setAddingTask(false);
                  }}
                  label="Dump"
                  active={brainDumpOpen}
                  icon={
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 19c-2-.5-3.5-2-4-3.5C3.5 14 3 12 3 10c0-3 1.5-5 3.5-6C7.5 3 9.5 2.5 11.5 3c2-.5 4.5.5 6 2.5 1.5 2 2 4.5 1.5 6.5-.5 1.5-1.5 2.5-2.5 3 .5 1 .5 2 0 3-.5 1-1.5 1.5-2.5 2-1.5 0-2.5-.5-3.5-1.5C9.5 19.5 8.5 19.5 8 19Z"/>
                      <path d="M9.5 8.5c-.5 2 0 4 1.5 5.5"/>
                    </svg>
                  }
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Rituals section */}
      <div style={{ marginBottom: '32px' }}>
        <SectionLabel
          collapsible
          isOpen={ritualsOpen}
          onToggle={() => setRitualsOpen((v) => !v)}
        >
          Rituals
        </SectionLabel>
        <motion.div
          variants={collapseVariants}
          animate={ritualsOpen ? 'open' : 'closed'}
          initial={false}
          style={{ overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={modeListVariants}
              initial="enter"
              animate="visible"
              exit="exit"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <AnimatePresence initial={false}>
                  {filteredRituals.map((ritual) => (
                    <motion.div
                      key={ritual.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.18, ease: [0.4, 0, 0.2, 1] } }}
                      style={{ overflow: 'hidden' }}
                    >
                      <RitualCard
                        id={ritual.id}
                        title={ritual.title}
                        isCompletedToday={ritual.completed_date === today}
                        onToggle={(id, completed) =>
                          updateRitual(id, { completed_date: completed ? today : null })
                        }
                        onUpdate={(id, title) => updateRitual(id, { title })}
                        onDelete={deleteRitual}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
                {addingRitual && (
                  <InlineAddTask
                    onAdd={async (title) => {
                      await addRitual(title, mode);
                      setAddingRitual(false);
                    }}
                    onCancel={() => setAddingRitual(false)}
                  />
                )}
                {!addingRitual && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <AddButton onClick={() => setAddingRitual(true)} />
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Plans preview */}
      <div>
        <SectionLabel
          collapsible
          isOpen={plansOpen}
          onToggle={() => setPlansOpen((v) => !v)}
        >
          Plans
        </SectionLabel>
        <motion.div
          variants={collapseVariants}
          animate={plansOpen ? 'open' : 'closed'}
          initial={false}
          style={{ overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={modeListVariants}
              initial="enter"
              animate="visible"
              exit="exit"
            >
              {upcomingPlans.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                  {upcomingPlans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                      readonly={true}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
    </>
  );
}
