'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseISO } from 'date-fns';
import { usePlans } from '@/hooks/usePlans';
import { PlanCard } from '@/components/PlanCard';
import { AddButton } from '@/components/AddButton';
import { InlineAddPlan } from '@/components/InlineAddPlan';

export default function PlansPage() {
  const { plans, addPlan, updatePlan, deletePlan } = usePlans();
  const [addingPlan, setAddingPlan] = useState(false);

  const sortedPlans = [...plans].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return parseISO(a.date).getTime() - parseISO(b.date).getTime();
  });

  return (
    <div className="page-container">
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
          Plans
        </h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <AnimatePresence initial={false}>
          {sortedPlans.map((plan) => (
            <motion.div
              key={plan.id}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <PlanCard
                plan={plan}
                onUpdate={(id, updates) => updatePlan(id, updates)}
                onDelete={deletePlan}
                onEnter={() => setAddingPlan(true)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {addingPlan && (
        <div style={{ marginTop: '8px' }}>
          <InlineAddPlan
            onAdd={async (title, date) => { await addPlan(title, date); }}
            onCancel={() => setAddingPlan(false)}
          />
        </div>
      )}
      {!addingPlan && (
        <div style={{ marginTop: '8px' }}>
          <AddButton onClick={() => setAddingPlan(true)} />
        </div>
      )}
    </div>
  );
}
