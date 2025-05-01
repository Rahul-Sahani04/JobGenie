import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import Layout from '../components/layout/Layout';
import SearchBar from '../components/common/SearchBar';
import JobList from '../components/jobs/JobList';
import JobFilters from '../components/jobs/JobFilters';
import Button from '../components/common/Button';
import { useJobSearch } from '../hooks/useJobs';
import { JobType, ExperienceLevel } from '../types/job';
import { useAuth } from '../context/AuthContext';

const JobSearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get search params from URL
  const searchParams = new URLSearchParams(location.search);
  const queryParam = searchParams.get('query') || '';
  const locationParam = searchParams.get('location') || '';
  
  // State for filters drawer on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Initialize job search hook with initial URL params
  const { jobs, totalJobs, currentPage, isLoading, error, updateSearch, nextPage, prevPage } = useJobSearch({
    query: queryParam,
    location: locationParam
  });
  
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
  
  // Apply filters
  const handleApplyFilters = (filters: Partial<typeof activeFilters>) => {
    setActiveFilters({
      ...activeFilters,
      ...filters
    });
    
    updateSearch({
      query: queryParam,
      location: locationParam,
      jobType: filters.jobTypes?.[0],
      experienceLevel: filters.experienceLevels?.[0],
      remote: filters.remote || false
    });
    
    // Close mobile filters
    setShowFilters(false);
  };
  
  // Handle job saving
  const handleSaveJob = (jobId: string) => {
    if (!user) {
      navigate('/login?redirect=/jobs');
      return;
    }
    
    // Toggle saved state in a real app
    console.log(`Toggling save state for job: ${jobId}`);
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
            
            <div className="md:hidden">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full"
                leftIcon={<Filter size={16} />}
              >
                Filters
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - desktop */}
            <div className="hidden md:block md:w-80 lg:w-96 flex-shrink-0">
              <JobFilters
                initialFilters={activeFilters}
                onApplyFilters={handleApplyFilters}
              />
            </div>
            
            {/* Filters - mobile drawer */}
            {showFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
                <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-lg overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <JobFilters
                      initialFilters={activeFilters}
                      onApplyFilters={handleApplyFilters}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Job Listings */}
            <div className="flex-grow">
              {/* Results info */}
              {!isLoading && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">
                      {totalJobs === 0 ? 'No jobs found' : `Showing ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, totalJobs)} of ${totalJobs} jobs`}
                    </p>
                    
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                      <select className="border border-gray-300 rounded p-1 text-sm">
                        <option>Most relevant</option>
                        <option>Newest</option>
                        <option>Salary: high to low</option>
                        <option>Salary: low to high</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Job list */}
              <JobList
                jobs={jobs}
                isLoading={isLoading}
                error={error}
                savedJobs={user?.savedJobs || []}
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