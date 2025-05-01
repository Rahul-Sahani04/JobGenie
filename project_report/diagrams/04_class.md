classDiagram
    class User {
        +String id
        +String name
        +String email
        +String password
        +Profile profile
        +Preferences preferences
        +register()
        +login()
        +updateProfile()
        +updatePreferences()
    }

    class Profile {
        +String userId
        +String resume
        +String[] skills
        +String[] experience
        +String education
        +update()
        +uploadResume()
    }

    class Job {
        +String id
        +String title
        +String company
        +String description
        +String[] requirements
        +String location
        +Number salary
        +String status
        +create()
        +update()
        +delete()
        +search()
    }

    class Application {
        +String id
        +String userId
        +String jobId
        +String status
        +Date appliedDate
        +String[] documents
        +submit()
        +updateStatus()
        +withdraw()
    }

    class JobPreferences {
        +String userId
        +String[] jobTypes
        +String[] locations
        +Number expectedSalary
        +String[] industries
        +update()
        +getRecommendations()
    }

    class RecommendationEngine {
        +getPersonalizedJobs()
        +calculateJobMatch()
        +updateUserPreferences()
        +generateInsights()
    }

    class SearchService {
        +searchJobs()
        +applyFilters()
        +sortResults()
        +saveSearch()
    }

    class NotificationService {
        +sendJobAlert()
        +sendApplicationUpdate()
        +sendStatusChange()
        +managePreferences()
    }

    User "1" -- "1" Profile
    User "1" -- "1" JobPreferences
    User "1" -- "*" Application
    Job "1" -- "*" Application
    JobPreferences -- RecommendationEngine
    User -- SearchService
    Application -- NotificationService