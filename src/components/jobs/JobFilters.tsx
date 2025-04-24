import React, { useState } from 'react';
import { ExperienceLevel, JobType } from '../../types/job';

interface FilterOptions {
  jobTypes: JobType[];
  experienceLevels: ExperienceLevel[];
  remote: boolean;
}

interface JobFiltersProps {
  initialFilters?: Partial<FilterOptions>;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  className?: string;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  initialFilters = {},
  onApplyFilters,
  className = '',
}) => {
  const [filters, setFilters] = useState<Partial<FilterOptions>>({
    jobTypes: initialFilters.jobTypes || [],
    experienceLevels: initialFilters.experienceLevels || [],
    remote: initialFilters.remote || false,
  });

  const handleJobTypeChange = (jobType: JobType) => {
    setFilters((prev) => {
      const updatedJobTypes = prev.jobTypes?.includes(jobType)
        ? prev.jobTypes.filter((type) => type !== jobType)
        : [...(prev.jobTypes || []), jobType];

      return { ...prev, jobTypes: updatedJobTypes };
    });
  };

  const handleExperienceLevelChange = (level: ExperienceLevel) => {
    setFilters((prev) => {
      const updatedLevels = prev.experienceLevels?.includes(level)
        ? prev.experienceLevels.filter((l) => l !== level)
        : [...(prev.experienceLevels || []), level];

      return { ...prev, experienceLevels: updatedLevels };
    });
  };

  const handleRemoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, remote: e.target.checked }));
  };

  const applyFilters = () => {
    onApplyFilters(filters);
  };

  const resetFilters = () => {
    setFilters({
      jobTypes: [],
      experienceLevels: [],
      remote: false,
    });
    onApplyFilters({});
  };

  return (
    <div className={`bg-white rounded-lg shadow p-5 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>

      {/* Job Type */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Job Type</h4>
        <div className="space-y-2">
          {(['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'] as JobType[]).map(
            (type) => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.jobTypes?.includes(type) || false}
                  onChange={() => handleJobTypeChange(type)}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">{type}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Experience Level */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-2">Experience Level</h4>
        <div className="space-y-2">
          {(['Entry level', 'Mid level', 'Senior level', 'Executive'] as ExperienceLevel[]).map(
            (level) => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.experienceLevels?.includes(level) || false}
                  onChange={() => handleExperienceLevelChange(level)}
                  className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <span className="ml-2 text-gray-700">{level}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Remote */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.remote || false}
            onChange={handleRemoteChange}
            className="h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <span className="ml-2 text-gray-700">Remote jobs only</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button
          onClick={applyFilters}
          className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>
        <button
          onClick={resetFilters}
          className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default JobFilters;