export interface User {
  _id: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  savedJobs: string[];
  preferences?: UserPreferences;
  resume?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  phone?: string;
  location?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
  experience?: number;
  education?: {
    degree?: string;
    field?: string;
    institution?: string;
  };
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface UserPreferences {
  jobTypes: ('Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance')[];
  locations: string[];
  experienceLevels: ('Entry level' | 'Mid level' | 'Senior level' | 'Executive')[];
  remote: boolean;
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  industries?: string[];
  skills?: string[];
  jobCategories?: string[];
  notificationPreferences?: {
    email: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
}