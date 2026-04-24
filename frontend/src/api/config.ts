import axiosInstance from './axiosInstance';
import { RoleUIConfig } from '../config/roleConfig';
import { Role } from '../types';

export const fetchRoleConfig = async (role: Role): Promise<RoleUIConfig> => {
  const response = await axiosInstance.get<{ success: boolean; data: RoleUIConfig; error: string | null }>(`/configs/${role}`);
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.error || 'Failed to fetch role config');
};

export const updateRoleConfig = async (role: Role, config: RoleUIConfig): Promise<void> => {
  await axiosInstance.put(`/configs/${role}`, config);
};
