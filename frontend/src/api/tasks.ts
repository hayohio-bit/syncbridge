import axiosInstance from './axiosInstance';
import type { TaskListDto, TaskDetailDto, TaskStatus } from '../types';

export const tasksApi = {
  createTask: async (data: Record<string, unknown>) => {
    const res = await axiosInstance.post<{ success: boolean; data: TaskDetailDto; error: string }>('/tasks', data);
    return res.data;
  },
  getTasks: async (status?: TaskStatus, projectId?: number, keyword?: string) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (projectId) params.append('projectId', projectId.toString());
    if (keyword) params.append('keyword', keyword);
    
    const url = `/tasks?${params.toString()}`;
    const res = await axiosInstance.get<{ success: boolean; data: TaskListDto[]; error: string }>(url);
    return res.data;
  },
  getTask: async (taskId: number) => {
    const res = await axiosInstance.get<{ success: boolean; data: TaskDetailDto; error: string }>(`/tasks/${taskId}`);
    return res.data;
  },
  updateTask: async (taskId: number, data: Record<string, unknown>) => {
    const res = await axiosInstance.patch<{ success: boolean; data: void; error: string }>(`/tasks/${taskId}`, data);
    return res.data;
  },
  deleteTask: async (taskId: number) => {
    const res = await axiosInstance.delete<{ success: boolean; data: void; error: string }>(`/tasks/${taskId}`);
    return res.data;
  },
};
