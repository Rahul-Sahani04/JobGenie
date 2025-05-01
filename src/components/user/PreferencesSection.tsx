import React from 'react';
import { Card } from '../ui/card';
import JobPreferences from './JobPreferences';
import { UserPreferences } from '@/types/auth';
import usePreferences from '@/hooks/usePreferences';
import { Loader2 } from 'lucide-react';

interface PreferencesSectionProps {
  userId: string;
  onUpdate?: () => void;
}

const PreferencesSection: React.FC<PreferencesSectionProps> = ({ userId, onUpdate }) => {
  const { preferences, loading, error, updatePreferences } = usePreferences(userId);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading preferences...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-destructive">
          <p>Error loading preferences: {error}</p>
        </div>
      </Card>
    );
  }

  const handleSave = async (newPreferences: UserPreferences) => {
    try {
      await updatePreferences(newPreferences);
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  };

  return <JobPreferences preferences={preferences} onSave={handleSave} />;
};

export default PreferencesSection;