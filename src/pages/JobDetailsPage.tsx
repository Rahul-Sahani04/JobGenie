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

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { job, isLoading, error } = useJobDetails(id);
  const { user } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if job is saved
  useEffect(() => {
    if (user && user.savedJobs && id) {
      setIsSaved(user.savedJobs.includes(id));
    }
  }, [user, id]);
  
  const handleSaveJob = () => {
    // Toggle saved status
    setIsSaved(!isSaved);
    
    // In a real app, call API to save/unsave the job
    console.log(`${isSaved ? 'Unsaving' : 'Saving'} job: ${id}`);
  };
  
  // Get "similar" jobs
  const similarJobs = [
    {
      id: 'job-101',
      title: 'Frontend Engineer',
      company: 'WebTech Inc',
      location: 'Remote',
      jobType: 'Full-time',
      postedDate: new Date(Date.now() - 3 * 86400000).toISOString(),
    },
    {
      id: 'job-102',
      title: 'UI/UX Designer',
      company: 'Creative Studios',
      location: 'New York',
      jobType: 'Full-time',
      postedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    },
    {
      id: 'job-103',
      title: 'JavaScript Developer',
      company: 'SoftSolutions',
      location: 'San Francisco',
      jobType: 'Contract',
      postedDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    },
  ];
  
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
              {!isLoading && job && (
                <Card className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-md bg-primary-100 flex items-center justify-center text-primary-700 mr-3">
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{job.company}</h4>
                      <a href="#" className="text-sm text-primary-600 hover:underline">
                        View company profile
                      </a>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Building size={16} className="mr-2" />
                      <span>50-200 employees</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Similar Jobs */}
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                
                <div className="space-y-4">
                  {similarJobs.map((job) => (
                    <Link to={`/jobs/${job.id}`} key={job.id}>
                      <div className="border-b border-gray-100 pb-4">
                        <h4 className="font-medium text-gray-900 hover:text-primary-600">{job.title}</h4>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                          <div className="flex items-center">
                            <MapPin size={12} className="mr-1" />
                            <span>{job.location}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Briefcase size={12} className="mr-1" />
                            <span>{job.jobType}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            <span>{formatDistanceToNow(job.postedDate)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    as="a"
                    href="/jobs"
                    variant="outline"
                    fullWidth
                  >
                    View More Jobs
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobDetailsPage;