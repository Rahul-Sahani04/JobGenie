import { useState, useCallback } from 'react';
import { UserPreferences } from '@/types/auth';
import api from '@/services/api';

export const usePreferences = (userId: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    jobTypes: [],
    locations: [],
    experienceLevels: [],
    remote: false,
  });

  const loadPreferences = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/users/${userId}/preferences`);
      setPreferences(response.data);
    } catch (err) {
      setError('Failed to load preferences');
      console.error('Error loading preferences:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const updatePreferences = useCallback(async (newPreferences: UserPreferences) => {
    try {
      setError(null);
      const response = await api.put(`/api/users/${userId}/preferences`, newPreferences);
      setPreferences(response.data);
      return response.data;
    } catch (err) {
      setError('Failed to update preferences');
      console.error('Error updating preferences:', err);
      throw err;
    }
  }, [userId]);

  return {
    preferences,
    loading,
    error,
    loadPreferences,
    updatePreferences,
  };
};

export default usePreferences;