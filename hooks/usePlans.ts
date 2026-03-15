'use client';

import { useData } from '@/lib/DataContext';

export function usePlans() {
  const { plans, plansLoading, addPlan, updatePlan, deletePlan, reorderPlans } = useData();
  return { plans, loading: plansLoading, addPlan, updatePlan, deletePlan, reorderPlans };
}
