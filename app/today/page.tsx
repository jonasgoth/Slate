'use client';

import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useTodos } from '@/hooks/useTodos';
import { usePlans } from '@/hooks/usePlans';
import { useData } from '@/lib/DataContext';
import { TaskCard } from '@/components/TaskCard';
import { PlanCard } from '@/components/PlanCard';
import { SectionLabel } from '@/components/SectionLabel';
import { AddButton } from '@/components/AddButton';
import { InlineAddTask } from '@/components/InlineAddTask';
import { SortableList } from '@/components/SortableList';
import type { Todo } from '@/types';

export default function TodayPage() {
  const { today } = useData();
  const { todos, addTodo, updateTodo, deleteTodo, reorderTodos, moveToBacklog } = useTodos();
  const { plans } = usePlans();

  const [addingTask, setAddingTask] = useState(false);

  const dayName = format(new Date(), 'EEEE');
  const dateLabel = format(new Date(), 'MMMM d');

  const upcomingPlans = plans.slice(0, 3);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            color: 'var(--Text-Primary, rgba(0, 0, 0, 0.85))',
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
        <p
          style={{
            color: '#9F989B',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            fontStyle: 'normal',
            fontWeight: 500,
            lineHeight: '16px',
            marginTop: '4px',
          }}
        >
          {dateLabel}
        </p>
      </div>

      {/* Focus section */}
      <div style={{ marginBottom: '32px' }}>
        <SectionLabel>Focus</SectionLabel>
        <SortableList<Todo>
          items={todos}
          onReorder={reorderTodos}
          gap={8}
          renderItem={(todo) => (
            <AnimatePresence initial={false}>
              <motion.div
                key={todo.id}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
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
              </motion.div>
            </AnimatePresence>
          )}
        />
        {addingTask && (
          <div style={{ marginTop: '8px' }}>
            <InlineAddTask
              onAdd={async (title) => { await addTodo(title); }}
              onCancel={() => setAddingTask(false)}
            />
          </div>
        )}
        {!addingTask && (
          <div style={{ marginTop: '8px' }}>
            <AddButton onClick={() => setAddingTask(true)} />
          </div>
        )}
      </div>

      {/* Plans preview */}
      <div>
        <SectionLabel>Plans</SectionLabel>
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
      </div>

    </div>
  );
}
