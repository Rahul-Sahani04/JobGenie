import React from 'react';
import { MapPin, Calendar, Briefcase, Building, ExternalLink, BookmarkPlus, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Job } from '../../types/job';
import { formatDate } from '../../utils/helpers';
import { cn } from '@/lib/utils';

interface JobDetailsProps {
  job: Job;
  isLoading: boolean;
  error: string | null;
  isSaved?: boolean;
  onSaveJob?: () => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  isLoading,
  error,
  isSaved = false,
  onSaveJob,
}) => {
  if (isLoading) {
    return (
      <Card className="w-full space-y-6">
        <CardContent className="pt-6">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-24" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 text-destructive space-y-2">
          <h3 className="font-semibold text-lg">Error Loading Job Details</h3>
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <Card className="mb-8 overflow-hidden">
      <CardContent className="pt-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {job.title}
              </h1>
              <p className="text-lg text-gray-700">
                {job.company_info ? job.company_info.name : job.company}
              </p>
            </div>
            
            {onSaveJob && (
              <Button
                onClick={() => onSaveJob(job._id)}
                variant={isSaved ? "secondary" : "outline"}
                size="sm"
                className={cn(
                  "transition-all duration-200",
                  isSaved && "bg-primary/10 text-primary hover:bg-primary/20"
                )}
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 size={16} className="mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkPlus size={16} className="mr-1" />
                    Save Job
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="flex items-center gap-1.5">
              <MapPin size={14} />
              {job.remote ? 'Remote' : job.location}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Briefcase size={14} />
              {job.jobType}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Building size={14} />
              {job.experienceLevel}
            </Badge>
            
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Calendar size={14} />
              Posted {formatDate(job.postedDate)}
            </Badge>
          </div>

          {job.salary && (
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {job.salary}
            </Badge>
          )}
        </div>

        {/* Description Section */}
        <div className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
            <div className="text-gray-700 whitespace-pre-line">{job.description}</div>
          </section>
          
          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsibilities</h2>
              <ul className="space-y-2 text-gray-700">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {job.qualifications && job.qualifications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Qualifications</h2>
              <ul className="space-y-2 text-gray-700">
                {job.qualifications.map((qualification, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {qualification}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-gray-50">
        <Button
          asChild
          size="lg"
          className="w-full font-medium gap-2 bg-primary hover:bg-primary/90"
        >
          <a
            href={job.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Apply for this position
            <ExternalLink size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobDetails;