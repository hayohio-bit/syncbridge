import axiosInstance from './axiosInstance';
import type { User } from '../types';

export const usersApi = {
  searchUsers: async (keyword: string) => {
    const res = await axiosInstance.get<{ success: boolean; data: User[]; error: string }>(`/users/search?keyword=${encodeURIComponent(keyword)}`);
    return res.data;
  }
};
