import axios from 'axios';
import { JobSearchParams, JobsResponse } from '../types/job';

// Base API URL - in a real app, this would come from environment variables
const API_URL = 'http://127.0.0.1:5000';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., logout user)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Mock function to simulate API calls during development
export const mockAPI = {
  async getJobs(params: JobSearchParams): Promise<JobsResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Simulate API response
    return {
      jobs: Array.from({ length: 10 }, (_, i) => ({
        id: `job-${i}`,
        title: params.query 
          ? `${params.query} Developer` 
          : ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'UX Designer', 'Product Manager'][i % 5],
        company: ['TechCorp', 'Innovate Inc', 'CodeSphere', 'Global Solutions', 'NextGen Tech'][i % 5],
        location: params.location || ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'][i % 5],
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        responsibilities: [
          'Design and develop high-quality software',
          'Work collaboratively in an agile team',
          'Participate in code reviews and maintain coding standards',
          'Troubleshoot and debug applications'
        ],
        qualifications: [
          'Bachelor\'s degree in Computer Science or related field',
          '3+ years of professional experience',
          'Strong problem-solving skills',
          'Excellent communication skills'
        ],
        salary: `$${80 + i * 10}k - $${120 + i * 10}k`,
        jobType: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'][i % 5] as any,
        experienceLevel: ['Entry level', 'Mid level', 'Senior level', 'Executive'][Math.floor(i / 3) % 4] as any,
        postedDate: new Date(Date.now() - i * 86400000 * 3).toISOString(),
        applicationUrl: 'https://example.com/apply',
        remote: i % 3 === 0,
      })),
      total: 100,
      page: params.page || 1,
      limit: params.limit || 10,
    };
  },
  
  async getJobById(id: string) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    // Simulate job details
    const jobIndex = parseInt(id.split('-')[1] || '0');
    
    return {
      id,
      title: ['Frontend Developer', 'Backend Engineer', 'Full Stack Developer', 'UX Designer', 'Product Manager'][jobIndex % 5],
      company: ['TechCorp', 'Innovate Inc', 'CodeSphere', 'Global Solutions', 'NextGen Tech'][jobIndex % 5],
      location: ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo'][jobIndex % 5],
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      responsibilities: [
        'Design and develop high-quality software',
        'Work collaboratively in an agile team',
        'Participate in code reviews and maintain coding standards',
        'Troubleshoot and debug applications',
        'Mentor junior developers and contribute to team growth'
      ],
      qualifications: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of professional experience',
        'Strong problem-solving skills',
        'Excellent communication skills',
        'Expertise in relevant technologies and frameworks'
      ],
      salary: `$${80 + jobIndex * 10}k - $${120 + jobIndex * 10}k`,
      jobType: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'][jobIndex % 5] as any,
      experienceLevel: ['Entry level', 'Mid level', 'Senior level', 'Executive'][Math.floor(jobIndex / 3) % 4] as any,
      postedDate: new Date(Date.now() - jobIndex * 86400000 * 3).toISOString(),
      applicationUrl: 'https://example.com/apply',
      remote: jobIndex % 3 === 0,
    };
  }
};