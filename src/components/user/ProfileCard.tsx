import React, { useRef, useState } from 'react';
import { User, MapPin, Edit, Upload, Trash2, Eye } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { User as UserType } from '../../types/auth';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/auth';

interface ProfileCardProps {
  user: UserType;
  onEdit?: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setIsUploading(true);
  //     const { resume } = await authService.uploadResume(file);
  //     await updateUser({ resume });
  //   } catch (error) {
  //     console.error('Error uploading resume:', error);
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  // const handleDeleteResume = async () => {
  //   try {
  //     await updateUser({ resume: undefined });
  //   } catch (error) {
  //     console.error('Error deleting resume:', error);
  //   }
  // };

  console.log('User:', user);

  return (
    <Card className="relative">
      {/* {onEdit && (
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
          aria-label="Edit profile"
        >
          <Edit size={18} />
        </button>
      )} */}
      
      <div className="flex flex-col items-center">
        <div className="h-24 w-24 rounded-full bg-primary-100 flex items-center justify-center mb-4">
          <User size={48} className="text-primary-600" />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">
          {user.name}
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
      
      {/* <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-900">Resume</h3>
          
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            ref={fileInputRef}
          />
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} className="mr-2" />
            {user.resume ? 'Update Resume' : 'Upload Resume'}
          </Button>
        </div>
        
        {user.resume ? (
          <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {user.resume.split('/').pop() || 'resume.pdf'}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => window.open(user.resume, '_blank')}
                className="text-primary-600 text-sm hover:text-primary-700 flex items-center"
              >
                <Eye size={16} className="mr-1" />
                View
              </button>
              <button
                onClick={handleDeleteResume}
                className="text-error-600 text-sm hover:text-error-700 flex items-center"
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-600">
            No resume uploaded yet. Add your resume to apply for jobs more quickly.
          </p>
        )}
      </div> */}
    </Card>
  );
};

export default ProfileCard;