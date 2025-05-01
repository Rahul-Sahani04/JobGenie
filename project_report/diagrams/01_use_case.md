graph TB
    title[JobGenie Use Case Diagram]

    %% Actors
    JobSeeker((Job Seeker))
    Employer((Employer))
    Admin((Admin))

    %% Use Cases
    Register[Register Account]
    Login[Login]
    SearchJobs[Search Jobs]
    ApplyJobs[Apply for Jobs]
    TrackApps[Track Applications]
    UpdateProfile[Update Profile]
    PostJobs[Post Jobs]
    ManageApps[Manage Applications]
    ManageUsers[Manage Users]
    ManageSystem[Manage System]

    %% Relationships
    JobSeeker --> Register
    JobSeeker --> Login
    JobSeeker --> SearchJobs
    JobSeeker --> ApplyJobs
    JobSeeker --> TrackApps
    JobSeeker --> UpdateProfile

    Employer --> Register
    Employer --> Login
    Employer --> PostJobs
    Employer --> ManageApps

    Admin --> Login
    Admin --> ManageUsers
    Admin --> ManageSystem

    %% Extensions
    SearchJobs --> |extends| FilterJobs[Filter Jobs]
    SearchJobs --> |extends| SaveJobs[Save Jobs]
    ApplyJobs --> |includes| UploadResume[Upload Resume]
    UpdateProfile --> |includes| ManagePreferences[Manage Preferences]
    PostJobs --> |includes| SetRequirements[Set Requirements]