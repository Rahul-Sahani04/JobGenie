import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { X } from 'lucide-react';
import { UserPreferences } from '@/types/auth';

interface JobPreferencesProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => Promise<void>;
}

const JobPreferences: React.FC<JobPreferencesProps> = ({ preferences, onSave }) => {
  const [currentPreferences, setCurrentPreferences] = useState<UserPreferences>(preferences);
  const [saving, setSaving] = useState(false);

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'] as const;
  const experienceLevels = ['Entry level', 'Mid level', 'Senior level', 'Executive'] as const;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(currentPreferences);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Preferences</h2>
          <p className="text-sm text-gray-600">
            Set your job preferences to get more relevant job recommendations.
          </p>
        </div>

        {/* Job Types */}
        <div className="space-y-2">
          <Label>Job Types</Label>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <Button
                key={type}
                variant={currentPreferences.jobTypes.includes(type) ? "default" : "outline"}
                onClick={() => {
                  const updatedTypes = currentPreferences.jobTypes.includes(type)
                    ? currentPreferences.jobTypes.filter(t => t !== type)
                    : [...currentPreferences.jobTypes, type];
                  setCurrentPreferences({
                    ...currentPreferences,
                    jobTypes: updatedTypes,
                  });
                }}
                size="sm"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {/* Experience Levels */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <div className="flex flex-wrap gap-2">
            {experienceLevels.map((level) => (
              <Button
                key={level}
                variant={currentPreferences.experienceLevels.includes(level) ? "default" : "outline"}
                onClick={() => {
                  const updatedLevels = currentPreferences.experienceLevels.includes(level)
                    ? currentPreferences.experienceLevels.filter(l => l !== level)
                    : [...currentPreferences.experienceLevels, level];
                  setCurrentPreferences({
                    ...currentPreferences,
                    experienceLevels: updatedLevels,
                  });
                }}
                size="sm"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div className="space-y-2">
          <Label>Preferred Locations</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add a location"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  const value = input.value.trim();
                  if (value && !currentPreferences.locations.includes(value)) {
                    setCurrentPreferences({
                      ...currentPreferences,
                      locations: [...currentPreferences.locations, value],
                    });
                    input.value = '';
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {currentPreferences.locations.map((location) => (
              <Badge
                key={location}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {location}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    setCurrentPreferences({
                      ...currentPreferences,
                      locations: currentPreferences.locations.filter(l => l !== location),
                    });
                  }}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Remote Work */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Remote Work</Label>
            <p className="text-sm text-gray-600">Show remote job opportunities</p>
          </div>
          <Switch
            checked={currentPreferences.remote}
            onCheckedChange={(checked: boolean) => {
              setCurrentPreferences({
                ...currentPreferences,
                remote: checked,
              });
            }}
          />
        </div>

        {/* Salary Range */}
        <div className="space-y-2">
          <Label>Salary Range (Annual)</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Minimum"
                value={currentPreferences.salary?.min || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setCurrentPreferences({
                    ...currentPreferences,
                    salary: {
                      min: value,
                      max: currentPreferences.salary?.max || value,
                      currency: currentPreferences.salary?.currency || 'INR',
                    },
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="number"
                placeholder="Maximum"
                value={currentPreferences.salary?.max || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setCurrentPreferences({
                    ...currentPreferences,
                    salary: {
                      min: currentPreferences.salary?.min || 0,
                      max: value,
                      currency: currentPreferences.salary?.currency || 'INR',
                    },
                  });
                }}
              />
            </div>
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </Card>
  );
};

export default JobPreferences;