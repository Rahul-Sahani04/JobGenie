graph TD
    %% Main System
    JobGenie[JobGenie System] --> Frontend[Frontend Layer]
    JobGenie --> Backend[Backend Layer]
    JobGenie --> Database[Database Layer]

    %% Frontend Components
    Frontend --> Components[React Components]
    Frontend --> Services[Frontend Services]
    Frontend --> Context[Context Providers]

    Components --> CommonUI[Common UI]
    Components --> Pages[Pages]
    Components --> Features[Feature Components]

    CommonUI --> Button[Button]
    CommonUI --> Card[Card]
    CommonUI --> Input[Input]
    CommonUI --> LoadingState[LoadingState]

    Pages --> Home[HomePage]
    Pages --> JobSearch[JobSearchPage]
    Pages --> Profile[ProfilePage]
    Pages --> Applications[ApplicationsPage]

    Features --> JobList[JobList]
    Features --> JobFilters[JobFilters]
    Features --> ApplicationTracker[ApplicationTracker]
    Features --> ProfileManager[ProfileManager]

    Services --> ApiService[API Service]
    Services --> AuthService[Auth Service]
    Services --> JobService[Job Service]

    Context --> AuthContext[Auth Context]
    Context --> JobContext[Job Context]

    %% Backend Components
    Backend --> Controllers[Controllers]
    Backend --> Routes[Routes]
    Backend --> Middleware[Middleware]
    Backend --> Models[Models]

    Controllers --> AuthController[Auth Controller]
    Controllers --> JobController[Job Controller]
    Controllers --> ApplicationController[Application Controller]

    Routes --> AuthRoutes[Auth Routes]
    Routes --> JobRoutes[Job Routes]
    Routes --> ApplicationRoutes[Application Routes]

    Middleware --> Auth[Auth Middleware]
    Middleware --> Validation[Validation Middleware]
    Middleware --> ErrorHandler[Error Handler]

    Models --> UserModel[User Model]
    Models --> JobModel[Job Model]
    Models --> ApplicationModel[Application Model]

    %% Database Layer
    Database --> Collections[Collections]
    Database --> Indexes[Indexes]
    Database --> Backups[Backup System]

    Collections --> Users[Users Collection]
    Collections --> Jobs[Jobs Collection]
    Collections --> Applications[Applications Collection]
    Collections --> Profiles[Profiles Collection]