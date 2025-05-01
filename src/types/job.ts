export interface Company {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  website?: string;
  location: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;  // This is company_id from backend
  company_info?: Company;  // Full company info when available
  company_name: string;
  location: string;
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  salary?: {
    min: number;
    max: number;
    currency: string;
  }
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  postedDate: string;
  applicationUrl: string;
  sourceUrl: string;
  source: string;
  logo?: string;
  remote: boolean;
}

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';

export type ExperienceLevel = 'Entry level' | 'Mid level' | 'Senior level' | 'Executive';

export interface JobSearchParams {
  query?: string;
  location?: string;
  jobType?: JobType;
  experienceLevel?: ExperienceLevel;
  remote?: boolean;
  page?: number;
  limit?: number;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  limit: number;
}