export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  savedJobs: string[];
  preferences?: UserPreferences;
  resume?: string;
}

export interface UserPreferences {
  jobTypes: string[];
  locations: string[];
  experienceLevels: string[];
  remote: boolean;
  salary?: {
    min: number;
    max: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}