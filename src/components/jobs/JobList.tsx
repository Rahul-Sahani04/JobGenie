import React from 'react';
import JobCard from './JobCard';
import LoadingState from '../common/LoadingState';
import { Job } from '../../types/job';

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  savedJobs?: string[];
  onSaveJob?: (jobId: string) => void;
  emptyMessage?: string;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  error,
  savedJobs = [],
  onSaveJob,
  emptyMessage = 'No jobs found. Try adjusting your search criteria.',
}) => {
  if (isLoading) {
    return <LoadingState text="Loading jobs..." />;
  }

  if (error) {
    return (
      <div className="bg-error-50 border border-error-200 rounded-md p-4 text-error-700">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          saved={savedJobs.includes(job.id)}
          onSave={onSaveJob ? () => onSaveJob(job.id) : undefined}
        />
      ))}
    </div>
  );
};

export default JobList;