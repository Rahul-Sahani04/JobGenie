import React from 'react';
import { MapPin, Calendar, Briefcase, Building, ExternalLink } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { Job } from '../../types/job';
import { formatDate } from '../../utils/helpers';

interface JobDetailsProps {
  job: Job;
  isLoading: boolean;
  error: string | null;
  isSaved?: boolean;
  onSaveJob?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  isLoading,
  error,
  isSaved = false,
  onSaveJob,
}) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded mb-6 w-2/4"></div>
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
        <div className="h-40 bg-gray-200 rounded mb-4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-md p-4 text-error-700">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Card className="mb-8">
      <div className="border-b border-gray-200 pb-5 mb-5">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-lg text-gray-700 mt-1">{job.company}</p>
          </div>
          
          {onSaveJob && (
            <Button
              onClick={onSaveJob}
              variant={isSaved ? 'primary' : 'outline'}
              leftIcon={isSaved ? '✓' : ''}
            >
              {isSaved ? 'Saved' : 'Save Job'}
            </Button>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center text-gray-600">
            <MapPin size={18} className="mr-1.5" />
            <span>{job.remote ? 'Remote' : job.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Briefcase size={18} className="mr-1.5" />
            <span>{job.jobType}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Building size={18} className="mr-1.5" />
            <span>{job.experienceLevel}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Calendar size={18} className="mr-1.5" />
            <span>Posted {formatDate(job.postedDate)}</span>
          </div>
        </div>
        
        {job.salary && (
          <div className="mt-4 inline-block bg-primary-50 text-primary-700 px-3 py-1 rounded-md font-medium">
            {job.salary}
          </div>
        )}
      </div>
      
      <div className="prose max-w-none mb-6">
        <h2 className="text-xl font-semibold mb-3">Job Description</h2>
        <p className="whitespace-pre-line">{job.description}</p>
      </div>
      
      {job.responsibilities && job.responsibilities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {job.responsibilities.map((responsibility, index) => (
              <li key={index}>{responsibility}</li>
            ))}
          </ul>
        </div>
      )}
      
      {job.qualifications && job.qualifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Qualifications</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {job.qualifications.map((qualification, index) => (
              <li key={index}>{qualification}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="pt-4 border-t border-gray-200">
        <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth
            rightIcon={<ExternalLink size={18} />}
          >
            Apply for this position
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default JobDetails;