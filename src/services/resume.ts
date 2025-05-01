import api from './api';
import { Resume, ApplicationStatus } from '@/types/resume';

const resumeService = {
  // Resume CRUD operations
  getResume: async (userId: string): Promise<Resume> => {
    const response = await api.get(`/api/resumes/${userId}`);
    return response.data;
  },

  updateResume: async (resumeId: string, resume: Partial<Resume>): Promise<Resume> => {
    const response = await api.put(`/api/resumes/${resumeId}`, resume);
    return response.data;
  },

  // Education
  addEducation: async (education: any) => {
    const response = await api.post('/api/education/', education);
    return response.data;
  },

  updateEducation: async (id: string, education: any) => {
    const response = await api.put(`/api/education/${id}`, education);
    return response.data;
  },

  deleteEducation: async (id: string) => {
    await api.delete(`/api/education/${id}`);
  },

  // Experience
  addExperience: async (experience: any) => {
    const response = await api.post('/api/experience/', experience);
    return response.data;
  },

  updateExperience: async (id: string, experience: any) => {
    const response = await api.put(`/api/experience/${id}`, experience);
    return response.data;
  },

  deleteExperience: async (id: string) => {
    await api.delete(`/api/experience/${id}`);
  },

  // Application tracking
  getApplications: async (userId: string): Promise<ApplicationStatus[]> => {
    const response = await api.get(`/api/applications/`);
    return response.data;
  },

  trackApplication: async (application: Omit<ApplicationStatus, 'id'>): Promise<ApplicationStatus> => {
    const response = await api.post('/api/applications/', application);
    return response.data;
  },

  updateApplicationStatus: async (
    applicationId: string,
    status: ApplicationStatus['status']
  ): Promise<ApplicationStatus> => {
    const response = await api.put(`/api/applications/${applicationId}/status/`, { status });
    return response.data;
  },

  // Profile completion
  getProfileCompletion: async (userId: string): Promise<{
    percentage: number;
    missingFields: string[];
  }> => {
    const response = await api.get(`/api/profile/completion/`);
    return response.data;
  },

  // LaTeX Resume Generation
  generateLatexResume: async (resumeId: string): Promise<{
    latexSource: string;
    pdfUrl: string;
  }> => {
    const response = await api.post(`/api/resumes/${resumeId}/latex/`);
    return response.data;
  }
};

export default resumeService;