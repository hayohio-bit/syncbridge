import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'TASK_ASSIGNED' | 'STATUS_CHANGED';
  taskId: number;
  title: string;
  message: string;
  senderName: string;
  timestamp: number;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  
  addNotification: (noti) => set((state) => ({
    notifications: [
      {
        ...noti,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        read: false,
      },
      ...state.notifications,
    ].slice(0, 20), // 최대 20개까지만 유지
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => 
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),

  clearAll: () => set({ notifications: [] }),
}));
