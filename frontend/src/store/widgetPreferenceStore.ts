import { create } from 'zustand';

interface WidgetPreferenceState {
  hiddenWidgets: string[];
  toggleWidget: (widgetId: string) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'syncbridge_widget_prefs';

const loadFromStorage = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (hiddenWidgets: string[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(hiddenWidgets));
};

export const useWidgetPreferenceStore = create<WidgetPreferenceState>((set) => ({
  hiddenWidgets: loadFromStorage(),

  toggleWidget: (widgetId) =>
    set((state) => {
      const isHidden = state.hiddenWidgets.includes(widgetId);
      const next = isHidden
        ? state.hiddenWidgets.filter((id) => id !== widgetId)
        : [...state.hiddenWidgets, widgetId];
      saveToStorage(next);
      return { hiddenWidgets: next };
    }),

  resetToDefault: () => {
    saveToStorage([]);
    set({ hiddenWidgets: [] });
  },
}));
