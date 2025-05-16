import api from './api';
import { Resume, ApplicationStatus } from '@/types/resume';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const resumeService = {
  // Resume CRUD operations
  getResume: async (userId: string): Promise<Resume> => {
    const response = await api.get(`/resumes/${userId}`);
    return response.data;
  },

  updateResume: async (resumeId: string, resume: Partial<Resume>): Promise<Resume> => {
    const response = await api.put(`/resumes/${resumeId}`, resume);
    return response.data;
  },

  // Education
  addEducation: async (education: any) => {
    const response = await api.post('/education/', education);
    return response.data;
  },

  updateEducation: async (id: string, education: any) => {
    const response = await api.put(`/education/${id}`, education);
    return response.data;
  },

  deleteEducation: async (id: string) => {
    await api.delete(`/education/${id}`);
  },

  // Experience
  addExperience: async (experience: any) => {
    const response = await api.post('/experience/', experience);
    return response.data;
  },

  updateExperience: async (id: string, experience: any) => {
    const response = await api.put(`/experience/${id}`, experience);
    return response.data;
  },

  deleteExperience: async (id: string) => {
    await api.delete(`/experience/${id}`);
  },

  // Application tracking
  getApplications: async (userId: string): Promise<ApplicationStatus[]> => {
    const response = await api.get(`/applications/`);
    return response.data;
  },

  trackApplication: async (application: Omit<ApplicationStatus, 'id'>): Promise<ApplicationStatus> => {
    const response = await api.post('/applications/', application);
    return response.data;
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus['status']
  ): Promise<ApplicationStatus> => {
    const response = await api.put(`/applications/${applicationId}/status/`, { status });
    return response.data;
  },

  // Profile completion
  getProfileCompletion: async (userId: string): Promise<{
    percentage: number;
    missingFields: string[];
  }> => {
    const response = await api.get(`/profile/completion/`);
    return response.data;
  },

  // LaTeX Resume Generation
  generateLatexResume: async (resumeId: string): Promise<{
    latexSource: string;
    pdfUrl: string;
  }> => {
    const response = await api.post(`/resumes/${resumeId}/latex/`);
    // Modify the pdfUrl to use the backend URL
    const pdfUrl = `${API_BASE_URL}${response.data.pdfUrl}`;
    return {
      ...response.data,
      pdfUrl,
    };
  }
};

export default resumeService;