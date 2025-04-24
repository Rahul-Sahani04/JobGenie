import { JobType, ExperienceLevel } from '../types/job';

// Format date to readable string
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// Format date as relative time (e.g., "2 days ago")
export const formatDistanceToNow = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
};

// Filter jobs by search params
export const filterJobs = <T extends { jobType: JobType; experienceLevel: ExperienceLevel; remote: boolean }>(
  jobs: T[],
  filters: { jobTypes?: JobType[]; experienceLevels?: ExperienceLevel[]; remote?: boolean }
): T[] => {
  return jobs.filter((job) => {
    // Filter by job type
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      if (!filters.jobTypes.includes(job.jobType)) {
        return false;
      }
    }
    
    // Filter by experience level
    if (filters.experienceLevels && filters.experienceLevels.length > 0) {
      if (!filters.experienceLevels.includes(job.experienceLevel)) {
        return false;
      }
    }
    
    // Filter by remote option
    if (filters.remote) {
      if (!job.remote) {
        return false;
      }
    }
    
    return true;
  });
};

// Extract base domain from URL
export const getBaseDomain = (url: string): string => {
  try {
    const { hostname } = new URL(url);
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  } catch (error) {
    return '';
  }
};

// Generate placeholder image by initials
export const getInitialsPlaceholder = (name: string, size = 100): string => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  
  return `https://ui-avatars.com/api/?name=${initials}&size=${size}&background=3B82F6&color=ffffff`;
};