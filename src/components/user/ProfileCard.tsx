import React from 'react';
import { User, MapPin, Edit } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { User as UserType } from '../../types/auth';

interface ProfileCardProps {
  user: UserType;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEdit }) => {
  return (
    <Card className="relative">
      {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          aria-label="Edit profile"
        >
          <Edit size={18} />
        </button>
      )}
      
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <User size={48} className="text-primary-600" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">
          {user.firstName} {user.lastName}
        </h2>
        
        <p className="text-gray-600 mt-1">{user.email}</p>
        
        {user.preferences?.locations && user.preferences.locations.length > 0 && (
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin size={16} className="mr-1" />
            <span>{user.preferences.locations.join(', ')}</span>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-900 mb-3">Job Preferences</h3>
        
        <div className="space-y-3">
          {user.preferences?.jobTypes && user.preferences.jobTypes.length > 0 && (
            <div>
              <span className="text-sm text-gray-600">Job Types:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.preferences.jobTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-md"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {user.preferences?.experienceLevels && user.preferences.experienceLevels.length > 0 && (
            <div>
              <span className="text-sm text-gray-600">Experience Levels:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.preferences.experienceLevels.map((level) => (
                  <span
                    key={level}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-md"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {user.preferences?.remote && (
            <div>
              <span className="text-sm text-gray-600">Remote Work:</span>
              <div className="mt-1">
                <span className="px-2 py-1 bg-green-50 text-green-700 text-sm rounded-md">
                  Open to remote work
                </span>
              </div>
            </div>
          )}
          
          {user.preferences?.salary && (
            <div>
              <span className="text-sm text-gray-600">Salary Range:</span>
              <div className="mt-1">
                <span className="px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-md">
                  ${user.preferences.salary.min.toLocaleString()} - ${user.preferences.salary.max.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Resume</h3>
          
          <Button variant="outline" size="sm">
            {user.resume ? 'Update Resume' : 'Upload Resume'}
          </Button>
        </div>
        
        {user.resume ? (
          <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-600">resume.pdf</span>
            <div className="flex space-x-2">
              <button className="text-primary-600 text-sm hover:text-primary-700">View</button>
              <button className="text-gray-600 text-sm hover:text-gray-700">Delete</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No resume uploaded yet. Add your resume to apply for jobs more quickly.
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProfileCard;