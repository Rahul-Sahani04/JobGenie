import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Heart } from 'lucide-react';
import Card from '../common/Card';
import { Job } from '../../types/job';
import { formatDistanceToNow } from '../../utils/helpers';

interface JobCardProps {
  job: Job;
  saved?: boolean;
  onSave?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, saved = false, onSave }) => {
  return (
    <Card hover className="border-l-4 border-l-primary-500 transition-all">
      <Link to={`/jobs/${job.id}`} className="block">
        <div className="flex justify-between">
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
              {job.title}
            </h3>
            
            <p className="text-gray-700 mt-1">
              {job.company_info ? job.company_info.name : job.company}
            </p>
            
            <div className="flex flex-wrap gap-3 mt-3">
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={16} className="mr-1" />
                <span>{job.remote ? 'Remote' : job.location}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm">
                <Briefcase size={16} className="mr-1" />
                <span>{job.jobType}</span>
              </div>
              
              <div className="flex items-center text-gray-600 text-sm">
                <Clock size={16} className="mr-1" />
                <span>{formatDistanceToNow(job.postedDate)}</span>
              </div>
            </div>
            
            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
              {job.description}
            </p>
          </div>
          
          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave();
              }}
              className={`flex-shrink-0 p-2 rounded-full focus:outline-none transition-colors ${
                saved
                  ? 'text-red-500 hover:bg-red-50'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              aria-label={saved ? 'Unsave job' : 'Save job'}
            >
              <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
        
        {job.salary && (
          <div className="mt-4 bg-gray-50 px-3 py-2 rounded-md inline-block">
            <span className="text-sm font-medium text-gray-800">{job.salary}</span>
          </div>
        )}
      </Link>
    </Card>
  );
};

export default JobCard;