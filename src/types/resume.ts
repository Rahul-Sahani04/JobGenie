export interface Profile {
  network: string;
  url: string;
  username: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  courses?: string[];
  achievements?: string[];
}

export interface WorkExperience {
  id?: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  summary?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface Project {
  id?: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  url?: string;
  technologies: string[];
  highlights: string[];
}

export interface Skill {
  id?: string;
  category: string;
  items: string[];
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id?: string;
  name: string;
  proficiency: string;
}

export interface ResumeContent {
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    profiles: Profile[];
  };
  education: Education[];
  workExperience: WorkExperience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  languages: Language[];
}

export interface ResumeVersion {
  versionNumber: number;
  createdAt: string;
  content: ResumeContent;
  notes?: string;
}

export interface ResumeMetadata {
  lastUpdated: string;
  targetPosition?: string;
  targetCompany?: string;
  customTags?: string[];
}

export enum ResumeTemplate {
  CLASSIC = 'classic',
  MODERN = 'modern',
  MINIMAL = 'minimal'
}

export interface Resume {
  _id: string;
  id: string;
  user: string;
  title: string;
  isDefault: boolean;
  content: ResumeContent;
  versions: ResumeVersion[];
  metadata: ResumeMetadata;
  template?: ResumeTemplate;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationStatus {
  id: string;
  jobId: string;
  userId: string;
  status: 'Applied' | 'In Review' | 'Accepted' | 'Rejected';
  appliedDate: string;
  originalJobUrl: string;
  notes?: string;
}

export interface TemplatePreview {
  id: ResumeTemplate;
  name: string;
  description: string;
  imageUrl: string;
}