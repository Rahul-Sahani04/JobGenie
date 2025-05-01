import api from './api';
import { UserPreferences } from '@/types/auth';

const preferencesService = {
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get('/api/preferences/');
    return response.data;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await api.put('/api/preferences/update/', preferences);
    return response.data;
  }
};

export default preferencesService;