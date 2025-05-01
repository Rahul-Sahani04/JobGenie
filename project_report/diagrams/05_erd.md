erDiagram
    USERS ||--o{ APPLICATIONS : submits
    USERS ||--|| PROFILES : has
    USERS ||--|| PREFERENCES : has
    JOBS ||--o{ APPLICATIONS : receives
    COMPANIES ||--o{ JOBS : posts

    USERS {
        ObjectId _id
        string name
        string email
        string password
        string role
        date createdAt
        date updatedAt
    }

    PROFILES {
        ObjectId _id
        ObjectId userId
        string resume
        string[] skills
        string[] experience
        string education
        string[] certifications
        date lastUpdated
    }

    PREFERENCES {
        ObjectId _id
        ObjectId userId
        string[] jobTypes
        string[] locations
        number expectedSalary
        string[] industries
        boolean remoteOnly
        date lastUpdated
    }

    JOBS {
        ObjectId _id
        ObjectId companyId
        string title
        string description
        string[] requirements
        string location
        number salary
        string type
        string status
        date postedDate
        date closingDate
    }

    APPLICATIONS {
        ObjectId _id
        ObjectId userId
        ObjectId jobId
        string status
        string[] documents
        string coverLetter
        date appliedDate
        date lastStatusUpdate
    }

    COMPANIES {
        ObjectId _id
        string name
        string description
        string industry
        string location
        string website
        string size
        date registeredDate
    }