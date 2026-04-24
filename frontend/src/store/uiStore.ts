import { create } from 'zustand';

interface UIState {
  isOverloaded: boolean;
  adaptiveMode: 'standard' | 'compact';
  workflowHint: string | null;
  lastTaskUpdate: number;
  evaluateSituation: (taskCount: number, overdueCount: number) => void;
  setWorkflowHint: (hint: string | null) => void;
  triggerTaskUpdate: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOverloaded: false,
  adaptiveMode: 'standard',
  workflowHint: null,
  lastTaskUpdate: Date.now(),
  evaluateSituation: (taskCount, overdueCount) => {
    const isOverloaded = taskCount > 15 || overdueCount > 3;
    set({ 
      isOverloaded,
      adaptiveMode: isOverloaded ? 'compact' : 'standard'
    });
  },
  setWorkflowHint: (hint) => set({ workflowHint: hint }),
  triggerTaskUpdate: () => set({ lastTaskUpdate: Date.now() }),
}));
