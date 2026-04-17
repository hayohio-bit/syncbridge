import axiosInstance from './axiosInstance';
import type { Attachment } from '../types';

const BASE_URL = 'http://localhost:8080/api';

export const attachmentsApi = {
  uploadFile: async (file: File, taskId: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId.toString());
    
    const res = await axiosInstance.post<{ success: boolean; data: Attachment; error: string }>(
      '/attachments/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  },
  getDownloadUrl: (id: number) => {
    return `${BASE_URL}/attachments/${id}/download`;
  },
};


