import axiosInstance from './axiosInstance';
import type { AuthResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await axiosInstance.post<{ success: boolean; data: AuthResponse; error: string }>('/auth/login', {
      email,
      password,
    });
    return res.data;
  },
  signup: async (email: string, password: string, name: string, role: string) => {
    const res = await axiosInstance.post<{ success: boolean; data: AuthResponse; error: string }>('/auth/signup', {
      email,
      password,
      name,
      role,
    });
    return res.data;
  },
  refresh: async (refreshToken: string) => {
    const res = await axiosInstance.post<{ success: boolean; data: { accessToken: string }; error: string }>(
      '/auth/refresh',
      { refreshToken }
    );
    return res.data;
  },
  logout: async (refreshToken: string) => {
    await axiosInstance.post('/auth/logout', { refreshToken });
  },
};
