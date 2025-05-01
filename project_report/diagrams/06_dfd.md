flowchart TB
    subgraph DFD Level 0
        User((User))
        System[JobGenie System]
        DB[(Database)]
        ExtAPI[External Job APIs]
        
        User -->|Input Data| System
        System -->|Results| User
        System -->|Store/Retrieve| DB
        System -->|Fetch Jobs| ExtAPI
        ExtAPI -->|Job Data| System
    end

    subgraph DFD Level 1
        %% External Entities
        User2((User))
        JobAPIs[External Job APIs]
        
        %% Processes
        Auth[1.0<br>Authentication]
        Search[2.0<br>Job Search]
        Apply[3.0<br>Application<br>Processing]
        Profile[4.0<br>Profile<br>Management]
        Recommend[5.0<br>Recommendation<br>Engine]
        
        %% Data Stores
        Users[(Users DB)]
        Jobs[(Jobs DB)]
        Applications[(Applications DB)]
        Profiles[(Profiles DB)]
        
        %% Data Flows
        User2 -->|Credentials| Auth
        Auth -->|Token| User2
        Auth -->|Verify| Users
        
        User2 -->|Search Query| Search
        Search -->|Results| User2
        Search -->|Fetch| Jobs
        JobAPIs -->|Job Data| Jobs
        
        User2 -->|Submit Application| Apply
        Apply -->|Status| User2
        Apply -->|Store| Applications
        Apply -->|Check| Jobs
        
        User2 -->|Profile Data| Profile
        Profile -->|Updated Data| User2
        Profile -->|Store| Profiles
        
        Recommend -->|Suggestions| User2
        Recommend -->|Read| Profiles
        Recommend -->|Match| Jobs
    end

    subgraph DFD Level 2 - Job Search
        %% External Entities
        User3((User))
        
        %% Processes
        Input[2.1<br>Search Input<br>Processing]
        Filter[2.2<br>Filter<br>Application]
        Sort[2.3<br>Result<br>Sorting]
        Display[2.4<br>Result<br>Display]
        
        %% Data Stores
        JobsDB[(Jobs DB)]
        PrefsDB[(Preferences DB)]
        
        %% Data Flows
        User3 -->|Search Terms| Input
        Input -->|Query| Filter
        PrefsDB -->|User Preferences| Filter
        Filter -->|Filtered Data| Sort
        JobsDB -->|Job Data| Sort
        Sort -->|Sorted Results| Display
        Display -->|Final Results| User3
    end