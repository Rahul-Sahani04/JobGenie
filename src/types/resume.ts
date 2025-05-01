export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Resume {
  id: string;
  userId: string;
  basics: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  pdfUrl?: string;
  latexSource?: string;
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