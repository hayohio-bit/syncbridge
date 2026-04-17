import axiosInstance from './axiosInstance';
import type { JargonResponse } from '../types';

export const jargonsApi = {
  getKeywords: async () => {
    // Note: This endpoint is public, it doesn't strictly need auth token but axiosInstance will attach it if present.
    const res = await axiosInstance.get<{ success: boolean; data: string[]; error: string }>('/jargons/keywords');
    return res.data;
  },
  translateKeyword: async (keyword: string) => {
    const encodeKw = encodeURIComponent(keyword);
    const res = await axiosInstance.get<{ success: boolean; data: JargonResponse; error: string }>(`/jargons/translate?keyword=${encodeKw}`);
    return res.data;
  },
  addFeedback: async (translationId: number, isHelpful: boolean) => {
    const res = await axiosInstance.post<{ success: boolean; data: null; error: string }>(
      `/jargons/translations/${translationId}/feedback?isHelpful=${isHelpful}`
    );
    return res.data;
  },
};
