import { useState, useEffect, useCallback } from 'react';
import { getJobs, getJobById, getSavedJobs } from '../services/jobs';
import { Job, JobSearchParams, JobsResponse } from '../types/job';

export const useJobSearch = (initialParams: JobSearchParams = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [params, setParams] = useState<JobSearchParams>({
    ...initialParams,
    page: initialParams.page || 1,
    limit: initialParams.limit || 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async (searchParams: JobSearchParams = params) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const finalParams = {
        ...searchParams,
        page: searchParams.page || 1,
        limit: searchParams.limit || 10,
        query: searchParams.query || undefined // Remove empty query
      };

      console.log('Fetching jobs with params:', finalParams);
      
      const response: JobsResponse = await getJobs(finalParams);
      console.log('Got response:', { page: response.page, total: response.total });
      
      setJobs(response.jobs);
      setTotalJobs(response.total);
      setCurrentPage(response.page);
      setParams(finalParams);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Only fetch jobs on initial mount with initialParams
  useEffect(() => {
    console.log('Initial fetch with params:', initialParams);
    fetchJobs(initialParams);
  }, []); // Empty dependency array

  const updateSearch = useCallback((newParams: Partial<JobSearchParams>) => {
    const updatedParams = {
      ...params,
      ...newParams,
      page: newParams.query !== undefined ? 1 : (newParams.page || params.page)
    };
    console.log('Updating search with params:', updatedParams);
    setParams(updatedParams);
    fetchJobs(updatedParams);
  }, [params, fetchJobs]);

  const nextPage = useCallback(() => {
    console.log('Current state:', { currentPage, totalJobs, limit: params.limit });
    const newPage = currentPage + 1;
    if (newPage * (params.limit || 10) <= totalJobs) {
      console.log('Moving to next page:', newPage);
      const updatedParams = { 
        ...params,
        page: newPage
      };
      setCurrentPage(newPage);
      setParams(updatedParams);
      fetchJobs(updatedParams);
    }
  }, [currentPage, params, totalJobs, fetchJobs]);

  const prevPage = useCallback(() => {
    console.log('Current state:', { currentPage, totalJobs, limit: params.limit });
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      console.log('Moving to previous page:', newPage);
      const updatedParams = { 
        ...params,
        page: newPage
      };
      setCurrentPage(newPage);
      setParams(updatedParams);
      fetchJobs(updatedParams);
    }
  }, [currentPage, params, fetchJobs]);

  return {
    jobs,
    totalJobs,
    currentPage,
    isLoading,
    error,
    updateSearch,
    nextPage,
    prevPage,
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
  }, [jobId]);

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