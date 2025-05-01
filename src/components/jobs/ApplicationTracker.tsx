import React from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { ExternalLink, Clock, CheckCircle, XCircle, HourglassIcon } from 'lucide-react';
import { ApplicationStatus } from '@/types/resume';
import { formatDate } from '@/utils/helpers';

interface ApplicationTrackerProps {
  applications: ApplicationStatus[];
  isLoading?: boolean;
}

const getStatusIcon = (status: ApplicationStatus['status']) => {
  switch (status) {
    case 'Applied':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'In Review':
      return <HourglassIcon className="h-4 w-4 text-yellow-500" />;
    case 'Accepted':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getStatusColor = (status: ApplicationStatus['status']) => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-50 text-blue-700';
    case 'In Review':
      return 'bg-yellow-50 text-yellow-700';
    case 'Accepted':
      return 'bg-green-50 text-green-700';
    case 'Rejected':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ applications, isLoading }) => {
  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  if (!applications.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No job applications yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Start applying to jobs to track your applications here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900">
                {application.jobId} {/* Replace with actual job title when available */}
              </h3>
              <p className="text-sm text-gray-500">
                Applied on {formatDate(application.appliedDate)}
              </p>
            </div>
            <Badge className={`${getStatusColor(application.status)} flex items-center gap-1.5`}>
              {getStatusIcon(application.status)}
              {application.status}
            </Badge>
          </div>
          
          {application.notes && (
            <p className="mt-2 text-sm text-gray-600">{application.notes}</p>
          )}
          
          <div className="mt-4 flex items-center justify-end space-x-2">
            <a
              href={application.originalJobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
            >
              View Original Post
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationTracker;