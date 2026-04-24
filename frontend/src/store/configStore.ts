import { create } from 'zustand';
import { RoleUIConfig, ROLE_CONFIGS } from '../config/roleConfig';
import { Role } from '../types';
import { fetchRoleConfig } from '../api/config';

interface ConfigState {
  roleConfig: RoleUIConfig | null;
  isLoading: boolean;
  error: string | null;
  loadConfig: (role: Role) => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  roleConfig: null,
  isLoading: false,
  error: null,
  loadConfig: async (role: Role) => {
    set({ isLoading: true, error: null });
    try {
      const config = await fetchRoleConfig(role);
      set({ roleConfig: config, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load dynamic role config, falling back to static config', error);
      set({ 
        roleConfig: ROLE_CONFIGS[role] || ROLE_CONFIGS.GENERAL, 
        isLoading: false,
        error: message 
      });
    }
  },
}));
