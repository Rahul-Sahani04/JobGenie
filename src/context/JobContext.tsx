import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Job, JobSearchParams, JobsResponse } from '../types/job';
import { getJobs, getJobById } from '../services/jobs';

interface JobContextProps {
  jobs: Job[];
  totalJobs: number;
  currentPage: number;
  searchParams: JobSearchParams;
  isLoading: boolean;
  error: string | null;
  selectedJob: Job | null;
  searchJobs: (params: JobSearchParams) => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  clearSelectedJob: () => void;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
}

const JobContext = createContext<JobContextProps | undefined>(undefined);

export const JobProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<JobSearchParams>({
    page: 1,
    limit: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const searchJobs = async (params: JobSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update search params
      const newParams = { ...params, page: params.page || 1 };
      setSearchParams(newParams);
      
      // Fetch jobs
      const response: JobsResponse = await getJobs(newParams);
      
      setJobs(response.jobs);
      setTotalJobs(response.total);
      setCurrentPage(response.page);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error searching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobById = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const job = await getJobById(id);
      setSelectedJob(job);
    } catch (err) {
      setError('Failed to fetch job details. Please try again later.');
      console.error('Error fetching job:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelectedJob = () => {
    setSelectedJob(null);
  };

  const nextPage = async () => {
    if (currentPage * searchParams.limit! < totalJobs) {
      const newPage = currentPage + 1;
      await searchJobs({ ...searchParams, page: newPage });
    }
  };

  const prevPage = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      await searchJobs({ ...searchParams, page: newPage });
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        totalJobs,
        currentPage,
        searchParams,
        isLoading,
        error,
        selectedJob,
        searchJobs,
        fetchJobById,
        clearSelectedJob,
        nextPage,
        prevPage,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobContext must be used within a JobProvider');
  }
  return context;
};