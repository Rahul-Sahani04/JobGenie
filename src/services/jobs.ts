import api, { mockAPI } from './api';
import { Job, JobSearchParams, JobsResponse } from '../types/job';

// Flag to use mock API instead of real API
const USE_MOCK_API = true;

export const getJobs = async (params: JobSearchParams): Promise<JobsResponse> => {
  try {
    if (USE_MOCK_API) {
      return await mockAPI.getJobs(params);
    }
    
    const response = await api.get('/jobs', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const getAllJobs = async (page = 1, limit = 20): Promise<JobsResponse> => {
  try {
    if (USE_MOCK_API) {
      return await mockAPI.getJobs({ page, limit });
    }
    
    const response = await api.get('/all_jobs', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};

export const getJobById = async (id: string): Promise<Job> => {
  try {
    if (USE_MOCK_API) {
      return await mockAPI.getJobById(id);
    }
    
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with id ${id}:`, error);
    throw error;
  }
};

export const saveJob = async (jobId: string): Promise<void> => {
  try {
    if (USE_MOCK_API) {
      // Mock implementation
      console.log(`Job ${jobId} saved`);
      return;
    }
    
    await api.post('/user/saved-jobs', { jobId });
  } catch (error) {
    console.error('Error saving job:', error);
    throw error;
  }
};

export const getSavedJobs = async (): Promise<Job[]> => {
  try {
    if (USE_MOCK_API) {
      // Mock implementation
      return Array.from({ length: 5 }, (_, i) => ({
        id: `saved-job-${i}`,
        title: ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'UX Designer', 'Product Manager'][i % 5],
        company: ['TechCorp', 'Innovate Inc', 'CodeSphere', 'Global Solutions', 'NextGen Tech'][i % 5],
        location: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'][i % 5],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        jobType: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'][i % 5] as any,
        experienceLevel: ['Entry level', 'Mid level', 'Senior level', 'Executive'][Math.floor(i / 2) % 4] as any,
        postedDate: new Date(Date.now() - i * 86400000 * 2).toISOString(),
        applicationUrl: 'https://example.com/apply',
        remote: i % 2 === 0,
      }));
    }
    
    const response = await api.get('/user/saved-jobs');
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    throw error;
  }
};

export const removeSavedJob = async (jobId: string): Promise<void> => {
  try {
    if (USE_MOCK_API) {
      // Mock implementation
      console.log(`Job ${jobId} removed from saved jobs`);
      return;
    }
    
    await api.delete(`/user/saved-jobs/${jobId}`);
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};