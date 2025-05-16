import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/common/SearchBar';
import JobList from '../components/jobs/JobList';
import JobFilters from '../components/jobs/JobFilters';
import { saveJob, unsaveJob } from '../services/jobs';
import Button from '../components/common/Button';
import { useJobSearch } from '../hooks/useJobs';
import { JobType, ExperienceLevel } from '../types/job';
import { useAuth } from '../context/AuthContext';
import { getSavedJobs } from '../services/jobs';

const JobSearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get search params from URL
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('query') || '';
  const locationParam = searchParams.get('location') || '';

  // State for managing job search
  const [savedJobs, setSavedJobs] = useState<string[]>(user?.savedJobs || []);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);

  // Fetch saved jobs on component mount
  React.useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = await getSavedJobs();
        setSavedJobs(jobs.map(job => job._id));
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      } finally {
        setLoadingSavedJobs(false);
      }
    };

    fetchSavedJobs();
  }, [user]);
  
  // State for filters drawer on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize job search hook with initial URL params
  const { jobs, totalJobs, currentPage, isLoading, error, updateSearch, nextPage, prevPage, setJobs } = useJobSearch(
    {
      query: queryParam,
      location: locationParam
    },
    user?.savedJobs || []
  );
  
  // Filter states
  const [activeFilters, setActiveFilters] = useState<{
    jobTypes: JobType[];
    experienceLevels: ExperienceLevel[];
    remote: boolean;
  }>({
    jobTypes: [],
    experienceLevels: [],
    remote: false
  });
  
  // Update URL and trigger search
  const updateUrlAndSearch = (params: Record<string, string | undefined>) => {
    const urlParams = new URLSearchParams(location.search);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlParams.set(key, value);
      } else {
        urlParams.delete(key);
      }
    });
    navigate({ search: urlParams.toString() }, { replace: true });
  };
  
  // Handle search submission
  const handleSearch = (query: string) => {
    updateUrlAndSearch({ query });
    
    updateSearch({
      query,
      location: locationParam,
      jobType: activeFilters.jobTypes[0],
      experienceLevel: activeFilters.experienceLevels[0],
      remote: activeFilters.remote
    });
  };
  
  // Handle location search
  const handleLocationSearch = (locationValue: string) => {
    updateUrlAndSearch({ location: locationValue });
    
    updateSearch({
      query: queryParam,
      location: locationValue,
      jobType: activeFilters.jobTypes[0],
      experienceLevel: activeFilters.experienceLevels[0],
      remote: activeFilters.remote
    });
  };
  

  // Handle job saving
  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      navigate('/login?redirect=/jobs');
      return;
    }

    try {
      const job = jobs.find(j => j._id === jobId);
      console.log('Job to ' + (job?.isSaved ? 'unsave' : 'save') + ':', job);
      if (!job) return;

      const isSaved = job.isSaved || user.savedJobs?.includes(jobId);
      
      if (isSaved) {
        await unsaveJob(jobId);
        if (user.savedJobs) {
          user.savedJobs = user.savedJobs.filter(_id => _id !== jobId);
        }
      } else {
        await saveJob(jobId);
        if (user.savedJobs) {
          user.savedJobs.push(jobId);
        } else {
          user.savedJobs = [jobId];
        }
      }

      // Update the isSaved state in the jobs list
      setJobs(jobs.map(j => {
        if (j._id === jobId) {
          return { ...j, isSaved: !isSaved };
        }
        return j;
      }));
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
    }
  };
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Job</h1>
            <p className="text-gray-600">Discover opportunities that match your experience and preferences</p>
          </div>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow">
              <SearchBar
                placeholder="Job title, keywords, or company"
                onSearch={handleSearch}
                initialValue={queryParam}
                debounceMs={500}
              />
            </div>
            
            <div className="md:w-64">
              <SearchBar
                placeholder="Location"
                onSearch={handleLocationSearch}
                initialValue={locationParam}
                debounceMs={500}
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Job Listings */}
            <div className="flex-grow">
              {/* Results info */}
              {!isLoading && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      {totalJobs === 0 ? 'No jobs found' : `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalJobs)} of ${totalJobs} jobs`}
                    </p>
                    
                  </div>
                </div>
              )}
              
              {/* Job list */}
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                error={error}
                savedJobs={savedJobs || []}
                onSaveJob={handleSaveJob}
              />
              
              {/* Pagination */}
              {!isLoading && totalJobs > 0 && (
                <div className="mt-8 flex justify-center">
                  <div className="inline-flex rounded-md shadow-sm">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
                      Page {currentPage}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={currentPage * 10 >= totalJobs}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobSearchPage;