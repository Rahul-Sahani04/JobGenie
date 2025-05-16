import { useState, useEffect, useCallback } from 'react';
import { getJobs, getJobById, getSavedJobs } from '../services/jobs';
import { Job, JobSearchParams, JobsResponse } from '../types/job';

export const useJobSearch = (initialParams: JobSearchParams = {}, savedJobIds: string[] = []) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Single function to fetch and update jobs
  const fetchAndUpdateJobs = useCallback(async (searchParams: JobSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const finalParams = {
        ...searchParams,
        page: searchParams.page || 1,
        limit: searchParams.limit || 10,
        query: searchParams.query || undefined
      };

      const response = await getJobs(finalParams);
      const updatedJobs = response.jobs.map(job => ({
        ...job,
        isSaved: savedJobIds.includes(job._id)
      }));

      setJobs(updatedJobs);
      setTotalJobs(response.total);
      setCurrentPage(finalParams.page);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [savedJobIds]);

  // Initial fetch
  useEffect(() => {
    fetchAndUpdateJobs(initialParams);
  }, []); // Only run once on mount

  // Update saved states when savedJobIds changes
  useEffect(() => {
    setJobs(currentJobs => currentJobs.map(job => ({
      ...job,
      isSaved: savedJobIds.includes(job._id)
    })));
  }, [savedJobIds]);

  const updateSearch = useCallback((newParams: Partial<JobSearchParams>) => {
    const searchParams = {
      ...initialParams,
      ...newParams,
      page: newParams.query !== undefined ? 1 : (newParams.page || currentPage)
    };
    fetchAndUpdateJobs(searchParams);
  }, [fetchAndUpdateJobs, currentPage, initialParams]);

  const nextPage = useCallback(() => {
    if ((currentPage) * 10 <= totalJobs) {
      fetchAndUpdateJobs({ ...initialParams, page: currentPage + 1 });
    }
  }, [currentPage, totalJobs, fetchAndUpdateJobs, initialParams]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      fetchAndUpdateJobs({ ...initialParams, page: currentPage - 1 });
    }
  }, [currentPage, fetchAndUpdateJobs, initialParams]);

  return {
    jobs,
    totalJobs,
    currentPage,
    isLoading,
    error,
    updateSearch,
    nextPage,
    prevPage,
    setJobs
  };
};

export const useJobDetails = (jobId?: string) => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJob = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const jobData = await getJobById(id);
      setJob(jobData);
    } catch (err) {
      setError('Failed to fetch job details. Please try again later.');
      console.error('Error fetching job details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchJob(jobId);
    }
  }, []);

  return { job, isLoading, error, fetchJob };
};

export const useSavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const jobs = await getSavedJobs();
      setSavedJobs(jobs);
    } catch (err) {
      setError('Failed to fetch saved jobs. Please try again later.');
      console.error('Error fetching saved jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  return { savedJobs, isLoading, error, refreshSavedJobs: fetchSavedJobs };
};