import { useState, useEffect } from 'react';
import { getJobs, getJobById, getSavedJobs } from '../services/jobs';
import { Job, JobSearchParams, JobsResponse } from '../types/job';

export const useJobSearch = (initialParams: JobSearchParams = {}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [params, setParams] = useState<JobSearchParams>(initialParams);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async (searchParams: JobSearchParams = params) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: JobsResponse = await getJobs(searchParams);
      
      setJobs(response.jobs);
      setTotalJobs(response.total);
      setCurrentPage(response.page);
      setParams(searchParams);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchJobs(initialParams);
  }, []);

  const nextPage = () => {
    if (currentPage * (params.limit || 10) < totalJobs) {
      const newPage = currentPage + 1;
      fetchJobs({ ...params, page: newPage });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      fetchJobs({ ...params, page: newPage });
    }
  };

  return {
    jobs,
    totalJobs,
    currentPage,
    isLoading,
    error,
    fetchJobs,
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