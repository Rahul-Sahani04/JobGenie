graph TD
    Home[Home Page] --> Login[Login]
    Home --> Register[Register]
    Home --> Search[Job Search]
    
    Login --> Dashboard[User Dashboard]
    Register --> Dashboard
    
    subgraph Dashboard Navigation
        Dashboard --> Profile[Profile Management]
        Dashboard --> JobSearch[Job Search]
        Dashboard --> Applications[My Applications]
        Dashboard --> Preferences[Job Preferences]
        Dashboard --> Recommendations[Recommended Jobs]
    end

    subgraph Profile Management
        Profile --> PersonalInfo[Personal Information]
        Profile --> Skills[Skills & Experience]
        Profile --> Resume[Resume Manager]
        Profile --> Settings[Account Settings]
    end

    subgraph Job Search Flow
        JobSearch --> SearchForm[Search Form]
        SearchForm --> Filters[Apply Filters]
        Filters --> Results[Search Results]
        Results --> JobDetails[Job Details]
        JobDetails --> Apply[Apply Now]
    end

    subgraph Application Management
        Applications --> Active[Active Applications]
        Applications --> History[Application History]
        Applications --> Saved[Saved Jobs]
        Active --> Status[Status Tracking]
        Active --> Documents[Application Documents]
    end

    subgraph Preferences Section
        Preferences --> JobTypes[Job Types]
        Preferences --> Locations[Preferred Locations]
        Preferences --> Industries[Target Industries]
        Preferences --> Salary[Salary Range]
        Preferences --> Alerts[Job Alerts]
    end

    subgraph Recommendations
        Recommendations --> MatchedJobs[Matched Jobs]
        Recommendations --> TrendingJobs[Trending in Your Field]
        Recommendations --> SimilarJobs[Similar to Applied]
    end

    %% External Links
    JobDetails --> Company[Company Profile]
    Apply --> ReviewApplication[Review Application]
    ReviewApplication --> SubmitApplication[Submit Application]
    Status --> Communication[Communication History]