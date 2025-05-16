import api from './api';
import { Resume, ApplicationStatus, ResumeTemplate, TemplatePreview } from '@/types/resume';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const TEMPLATE_PREVIEWS: TemplatePreview[] = [
  {
    id: ResumeTemplate.CLASSIC,
    name: 'Classic',
    description: 'A traditional resume layout with a clean and professional look',
    imageUrl: '/templates/classic-preview.png'
  },
  {
    id: ResumeTemplate.MODERN,
    name: 'Modern',
    description: 'A contemporary design with a fresh and dynamic feel',
    imageUrl: '/templates/modern-preview.png'
  },
  {
    id: ResumeTemplate.MINIMAL,
    name: 'Minimal',
    description: 'A sleek and minimalist design that focuses on content',
    imageUrl: '/templates/minimal-preview.png'
  }
];

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

  // Template management
  updateTemplate: async (resumeId: string, template: ResumeTemplate): Promise<Resume> => {
    const response = await api.put(`/resumes/${resumeId}/template`, { template });
    return response.data;
  },

  // LaTeX Resume Generation
  generateLatexResume: async (resumeId: string, template: ResumeTemplate = ResumeTemplate.CLASSIC): Promise<{
    latexSource: string;
    pdfUrl: string;
  }> => {
    const response = await api.post(`/resumes/${resumeId}/latex/`, { template });
    // Modify the pdfUrl to use the backend URL
    const pdfUrl = `${API_BASE_URL}${response.data.pdfUrl}`;
    return {
      ...response.data,
      pdfUrl,
    };
  },

  // Get template previews
  getTemplatePreviews: (): TemplatePreview[] => {
    return TEMPLATE_PREVIEWS;
  }
};

export default resumeService;