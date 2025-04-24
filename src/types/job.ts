export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  responsibilities?: string[];
  qualifications?: string[];
  salary?: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  postedDate: string;
  applicationUrl: string;
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