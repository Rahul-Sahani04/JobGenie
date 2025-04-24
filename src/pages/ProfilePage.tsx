import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileCard from '../components/user/ProfileCard';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import JobList from '../components/jobs/JobList';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import { useSavedJobs } from '../hooks/useJobs';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { savedJobs, isLoading: isLoadingSavedJobs, error, refreshSavedJobs } = useSavedJobs();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'saved' | 'applications'>('overview');
  
  // Handle job unsave
  const handleUnsaveJob = (jobId: string) => {
    // In a real app, call API to unsave the job
    console.log(`Unsaving job: ${jobId}`);
    refreshSavedJobs();
  };
  
  // Redirect to login if not authenticated
  if (isLoading) {
    return <LoadingState fullPage text="Loading profile..." />;
  }
  
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/3">
              <ProfileCard user={user} onEdit={() => console.log('Edit profile')} />
            </div>
            
            {/* Main Content */}
            <div className="md:w-2/3">
              {/* Tabs */}
              <div className="bg-white rounded-md shadow-sm mb-6">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === 'saved'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('saved')}
                  >
                    Saved Jobs
                  </button>
                  
                  <button
                    className={`px-4 py-3 font-medium text-sm ${
                      activeTab === 'applications'
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('applications')}
                  >
                    Applications
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Activity Summary */}
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-600 text-sm">Saved Jobs</p>
                        <p className="text-2xl font-bold text-gray-900">{user.savedJobs.length}</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-600 text-sm">Applications</p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-600 text-sm">Profile Views</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Recent Activity */}
                  <Card>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">Recent Jobs</h2>
                      
                      <Link to="/jobs" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                        Browse All
                      </Link>
                    </div>
                    
                    {savedJobs.length > 0 ? (
                      <div className="space-y-4">
                        {savedJobs.slice(0, 3).map((job) => (
                          <Link
                            key={job.id}
                            to={`/jobs/${job.id}`}
                            className="block border-b border-gray-100 pb-4 hover:bg-gray-50 -mx-5 px-5"
                          >
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <p className="text-gray-600 text-sm">{job.company}</p>
                            <p className="text-gray-500 text-xs mt-1">{job.location}</p>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No saved jobs yet. Start browsing!</p>
                    )}
                    
                    <div className="mt-4 pt-2">
                      <Button
                        as="a"
                        href="/jobs"
                        variant="outline"
                      >
                        Find Jobs
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
              
              {activeTab === 'saved' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Saved Jobs</h2>
                  
                  <JobList
                    jobs={savedJobs}
                    isLoading={isLoadingSavedJobs}
                    error={error}
                    savedJobs={user.savedJobs}
                    onSaveJob={handleUnsaveJob}
                    emptyMessage="You haven't saved any jobs yet."
                  />
                </div>
              )}
              
              {activeTab === 'applications' && (
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Applications</h2>
                  
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You haven't applied to any jobs yet.</p>
                    <Button as="a" href="/jobs" variant="primary">
                      Browse Jobs
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;