import axiosInstance from './axiosInstance';
import type { Project } from '../types';

export const projectsApi = {
  createProject: async (title: string, description: string) => {
    const res = await axiosInstance.post<{ success: boolean; data: number; error: string }>('/projects', {
      title,
      description,
    });
    return res.data;
  },
  getProjects: async () => {
    const res = await axiosInstance.get<{ success: boolean; data: Project[]; error: string }>('/projects');
    return res.data;
  },
};
