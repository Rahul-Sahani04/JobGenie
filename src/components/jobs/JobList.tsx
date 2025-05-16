import React from "react";
import { AlertCircle, FileSearch } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import JobCard from "./JobCard";
import { Job } from "../../types/job";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface JobListProps {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  savedJobs?: string[];
  onSaveJob?: (jobId: string) => void;
  emptyMessage?: string;
}

const JobList: React.FC<JobListProps> = ({
  jobs,
  isLoading,
  error,
  savedJobs = [],
  onSaveJob,
  emptyMessage = "No jobs found. Try adjusting your search criteria.",
}) => {
  const { user } = useAuth();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card
            key={i}
            className="animate-in fade-in-50 duration-500"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-5 w-20" />
                  ))}
                </div>
                <Skeleton className="h-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Jobs</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-4">
          <FileSearch className="h-12 w-12 text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">No Jobs Found</h3>
            <p className="text-muted-foreground text-sm">{emptyMessage}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, index) => {
        const savedJobIds = user?.savedJobs.map(saved  => saved._id) || [];
        const isSaved = savedJobIds.includes(job._id);

        return (
          <div
            key={job._id}
            className={cn(
              "animate-in fade-in-50 duration-500 slide-in-from-bottom-4"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <JobCard
              job={job}
              saved={isSaved}
              onSave={onSaveJob ? () => onSaveJob(job._id) : undefined}
            />
          </div>
        );
      })}
    </div>
  );
};

export default JobList;
