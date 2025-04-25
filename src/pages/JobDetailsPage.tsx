import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, MapPin, Clock, Briefcase, Building } from 'lucide-react';
import Layout from '../components/layout/Layout';
import JobDetails from '../components/jobs/JobDetails';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useJobDetails } from '../hooks/useJobs';
import { formatDistanceToNow } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { saveJob, removeSavedJob } from '../services/jobs';

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading, error } = useJobDetails(id);
  const { user } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Check if job is saved
  useEffect(() => {
    if (user && user.savedJobs && id) {
      setIsSaved(user.savedJobs.includes(id));
    }
  }, [user, id]);
  
  const handleSaveJob = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      setIsUpdating(true);
      if (isSaved) {
        await removeSavedJob(id!);
      } else {
        await saveJob(id!);
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (!job && !isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-4">The job you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/jobs"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to job search
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Link
              to="/jobs"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to job search
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <JobDetails
                job={job!}
                isLoading={isLoading}
                error={error}
                isSaved={isSaved}
                onSaveJob={handleSaveJob}
              />
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Company Card */}
              {!isLoading && job && job.company_info && (
                <Card className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full border-2 border-black/40 bg-primary-100 flex items-center justify-center text-primary-700 mr-3 rounded-">
                      {job.company_info.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{job.company_info.name}</h4>
                      {job.company_info.website && (
                        <a 
                          href={job.company_info.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:underline"
                        >
                          Visit website
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {job.company_info.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {job.company_info.description}
                    </p>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Building size={16} className="mr-2" />
                      <span>Company Size: Not Specified</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{job.company_info.location}</span>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Similar Jobs */}
              {!isLoading && job && (
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                  <p className="text-gray-600 text-sm">Similar jobs feature coming soon!</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;