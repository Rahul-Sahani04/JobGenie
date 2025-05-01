sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database
    participant JobAPI

    User->>Frontend: Search for jobs
    Frontend->>Backend: GET /api/jobs/search
    Backend->>JobAPI: Fetch job listings
    JobAPI-->>Backend: Return job data
    Backend-->>Frontend: Return search results
    Frontend-->>User: Display job listings

    User->>Frontend: Select job
    Frontend->>Backend: GET /api/jobs/:id
    Backend->>Database: Fetch job details
    Database-->>Backend: Return job data
    Backend-->>Frontend: Return job details
    Frontend-->>User: Display job details

    User->>Frontend: Submit application
    Frontend->>Backend: POST /api/applications
    Backend->>Database: Save application
    Database-->>Backend: Confirm save
    Backend->>Database: Update job status
    Database-->>Backend: Confirm update
    Backend-->>Frontend: Return success
    Frontend-->>User: Show confirmation

    Note over User,Frontend: Application Tracking
    User->>Frontend: Check application status
    Frontend->>Backend: GET /api/applications
    Backend->>Database: Fetch applications
    Database-->>Backend: Return applications
    Backend-->>Frontend: Return status
    Frontend-->>User: Display status