import * as React from 'react';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProfileCard from '../components/user/ProfileCard';
import PreferencesSection from '../components/user/PreferencesSection';
import SavedJobs from '../components/jobs/SavedJobs';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ResumeBuilder from '../components/resume/ResumeBuilder';
import ApplicationTracker from '../components/jobs/ApplicationTracker';
import ProfileCompletion from '../components/user/ProfileCompletion';
import LoadingState from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import resumeService from '../services/resume';
import { ApplicationStatus } from '../types/resume';
import type { User } from '../types/auth';

interface ProfileCompletionData {
  percentage: number;
  missingFields: string[];
}

type TabType = 'overview' | 'resume' | 'preferences' | 'saved-jobs';

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profileCompletion, setProfileCompletion] = useState<ProfileCompletionData>({
    percentage: 0,
    missingFields: []
  });
  const [applications, setApplications] = useState<ApplicationStatus[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);

  useEffect(() => {
    if (user) {
      void loadApplications();
      // void loadProfileCompletion();
    }
  }, [user]);

  const loadApplications = async (): Promise<void> => {
    if (!user) return;
    try {
      const data = await resumeService.getApplications(user.id);
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApplications(false);
    }
  };

  const loadProfileCompletion = async (): Promise<void> => {
    if (!user) return;
    try {
      const data = await resumeService.getProfileCompletion(user.id);
      setProfileCompletion(data);
    } catch (err) {
      console.error('Failed to load profile completion:', err);
    }
  };

  if (isLoading) {
    return <LoadingState fullPage text="Loading profile..." />;
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login?redirect=/profile" replace />;
  }

  if (!user) {
    return null;
  }

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'resume', label: 'Resume' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'saved-jobs', label: 'Saved Jobs' },
  ];

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="space-y-6">
              <ProfileCard user={user} onEdit={() => console.log('Edit profile')} />
              <ProfileCompletion 
                percentage={profileCompletion.percentage}
                missingFields={profileCompletion.missingFields}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <Card className="mb-6">
                <div className="flex border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      className={`px-4 py-3 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'text-primary-600 border-b-2 border-primary-600'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                      type="button"
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tab Content */}
              <div>
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600 text-sm">Profile Views</p>
                          <p className="text-2xl font-bold text-gray-900">12</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-gray-600 text-sm">Profile Completion</p>
                          <p className="text-2xl font-bold text-gray-900">{profileCompletion.percentage}%</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {activeTab === 'resume' && (
                  <ResumeBuilder onSave={loadProfileCompletion} />
                )}

                {activeTab === 'preferences' && (
                  <PreferencesSection 
                    userId={user.id} 
                    onUpdate={loadProfileCompletion}
                  />
                )}

                {activeTab === 'saved-jobs' && (
                  <SavedJobs />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;