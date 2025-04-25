import api from './api';
import { Job, JobSearchParams, JobsResponse } from '../types/job';

export const getJobs = async (params: JobSearchParams): Promise<JobsResponse> => {
  try {
    const response = await api.get('/jobs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getAllJobs = async (page = 1, limit = 20): Promise<JobsResponse> => {
  try {
    const response = await api.get('/all_jobs', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

export const getJobById = async (id: string): Promise<Job> => {
  try {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with id ${id}:`, error);
    throw error;
  }
};

export const saveJob = async (jobId: string): Promise<void> => {
  try {
    await api.post('/user/saved-jobs', { jobId });
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

export const getSavedJobs = async (): Promise<Job[]> => {
  try {
    const response = await api.get('/user/saved-jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

export const removeSavedJob = async (jobId: string): Promise<void> => {
  try {
    await api.delete(`/user/saved-jobs/${jobId}`);
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};