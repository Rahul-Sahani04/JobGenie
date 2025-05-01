stateDiagram-v2
    [*] --> Login
    Login --> Authenticated: Valid credentials
    Login --> Login: Invalid credentials

    Authenticated --> Dashboard

    state Dashboard {
        [*] --> SearchJobs
        SearchJobs --> ViewResults: Enter search criteria
        ViewResults --> ApplyFilter: Too many results
        ApplyFilter --> ViewResults
        ViewResults --> ViewJobDetails: Select job
    }

    ViewJobDetails --> CheckEligibility: Click Apply
    CheckEligibility --> PrepareApplication: Eligible
    CheckEligibility --> ViewJobDetails: Not eligible

    state PrepareApplication {
        [*] --> ReviewProfile
        ReviewProfile --> UpdateProfile: Incomplete
        UpdateProfile --> ReviewProfile
        ReviewProfile --> UploadDocuments: Complete
        UploadDocuments --> ReviewApplication
        ReviewApplication --> SubmitApplication
    }

    SubmitApplication --> ApplicationSubmitted: Success
    SubmitApplication --> PrepareApplication: Error

    ApplicationSubmitted --> TrackApplication
    TrackApplication --> ViewStatus

    state ViewStatus {
        [*] --> Pending
        Pending --> UnderReview
        UnderReview --> Shortlisted
        UnderReview --> Rejected
        Shortlisted --> Selected
        Shortlisted --> Rejected
    }

    ViewStatus --> Dashboard: Search more jobs
    ViewStatus --> [*]: Exit system

    note right of PrepareApplication
        User can update profile
        and documents before
        submitting application
    end note

    note right of ViewStatus
        Real-time status
        updates for submitted
        applications
    end note