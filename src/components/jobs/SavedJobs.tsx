import React, { useEffect, useState } from 'react';
import { Job } from '@/types/job';
import { getSavedJobs, unsaveJob } from '@/services/jobs';
import JobCard from './JobCard';
import { Card } from '../ui/card';
import { Loader2 } from 'lucide-react';

const SavedJobs: React.FC = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const jobs = await getSavedJobs();
      setSavedJobs(jobs);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsaveJob = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
      setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    } catch (error) {
      console.error('Error unsaving job:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <Card className="p-8 text-center text-gray-500">
        No saved jobs found. Start saving jobs you're interested in!
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {savedJobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          saved={true}
          onSave={() => handleUnsaveJob(job._id)}
        />
      ))}
    </div>
  );
};

export default SavedJobs;