import api from './api';
import { User } from '../types/auth';

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await api.post('/auth/register', data);
    const { token, user } = response.data;
    
    // Store token
    localStorage.setItem('token', token);
    
    return { token, user };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const uploadResume = async (file: File): Promise<{ resume: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/user/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw error;
  }
};

interface SavedJobsResponse {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary: string;
  postedDate: string;
  savedAt: string;
}

export const getSavedJobs = async (): Promise<SavedJobsResponse[]> => {
  try {
    const response = await api.get('/user/saved-jobs');
    
    return response.data;
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
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

export const removeSavedJob = async (jobId: string): Promise<void> => {
  try {
    await api.delete(`/user/saved-jobs?jobId=${jobId}`);
  } catch (error) {
    console.error('Error removing saved job:', error);
    throw error;
  }
};

interface JobApplication {
  id: number;
  jobId: string;
  status: string;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

export const getJobApplications = async (): Promise<JobApplication[]> => {
  try {
    const response = await api.get('/user/applications');
    return response.data;
  } catch (error) {
    console.error('Error fetching job applications:', error);
    throw error;
  }
};

export const applyToJob = async (jobId: string, notes?: string): Promise<JobApplication> => {
  try {
    const response = await api.post('/user/applications', { jobId, notes });
    return response.data;
  } catch (error) {
    console.error('Error applying to job:', error);
    throw error;
  }
};

export const updateApplication = async (
  applicationId: number,
  data: { status?: string; notes?: string }
): Promise<JobApplication> => {
  try {
    const response = await api.put(`/user/applications/${applicationId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating application:', error);
    throw error;
  }
};