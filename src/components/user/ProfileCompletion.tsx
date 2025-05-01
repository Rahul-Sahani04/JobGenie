import React from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';
import { AlertCircle } from 'lucide-react';

interface ProfileCompletionProps {
  percentage: number;
  missingFields: string[];
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ percentage, missingFields }) => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
          <span className="text-2xl font-bold text-primary">{percentage}%</span>
        </div>
        
        <Progress value={percentage} className="h-2" />
        
        {missingFields.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="h-4 w-4" />
              <span>Complete these items to improve your profile:</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1 ml-6 list-disc">
              {missingFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileCompletion;