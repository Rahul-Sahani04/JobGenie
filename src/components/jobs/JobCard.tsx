import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  Briefcase,
  Heart,
  Building2,
  InfoIcon,
  SunIcon,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Job } from "../../types/job";
import { formatDistanceToNow } from "../../utils/helpers";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  saved?: boolean;
  onSave?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, saved = false, onSave }) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        "border-l-4 border-l-primary"
      )}
    >
      <Link to={job.sourceUrl} target="_blank" className="block">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-gray-600">
                  <Building2 size={16} />
                  <span className="text-gray-700">
                    {job.company_info ? job.company_info.name : job.company}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{job.remote ? "Remote" : job.location}</span>
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1">
                  <Briefcase size={14} />
                  <span>{job.jobType}</span>
                </Badge>

                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{job.postedDate}</span>
                </Badge>
              </div>

              {/* <p className="text-sm text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors duration-200">
                {job.description}
              </p> */}

              {job.salary && (
                <Badge variant="secondary" className="text-sm font-medium">
                  {job.salary.min} - {job.salary.max} {job.salary.currency}
                </Badge>
              )}
            </div>

            {onSave && (
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "rounded-full transition-all duration-200",
                  saved
                    ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  onSave();
                }}
                aria-label={saved ? "Unsave job" : "Save job"}
              >
                <Heart
                  size={20}
                  className={cn(
                    "transition-transform duration-200",
                    "group-hover:scale-110",
                    saved && "fill-current"
                  )}
                />
              </Button>
            )}
            {/* Source logo */}
            {job.source === "Naukri" && (
              <div className="absolute top-4 right-4">
                <img 
                  src="https://static.naukimg.com/s/0/0/i/naukri-identity/naukri_gnb_logo.svg"
                  alt="Naukri Logo"
                  className="h-6 w-6" 
                  />
              </div>
            )}
            {job.source === "Shine" && (
              <div className="absolute top-4 right-4">
                <img 
                  src="https://www.shine.com/next/static/images/nova/logo.svg"
                  alt="Shine Logo"
                  className="h-6 w-6" 
                  />
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default JobCard;
