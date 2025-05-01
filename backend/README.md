# JobGenie Backend API Documentation

## Overview
JobGenie backend is a RESTful API service that provides job application tracking, user management, and resume management capabilities.

## Setup

### Prerequisites
- Node.js (>= 14.0.0)
- MongoDB
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
cd backend
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## Environment Variables
```
MONGODB_URI=mongodb://localhost:27017/jobgenie
PORT=5000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Routes

### Authentication Routes
`/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /register | Register new user | No |
| POST | /login | User login | No |
| GET | /profile | Get user profile | Yes |
| PUT | /profile | Update user profile | Yes |

#### Request Body Examples

Register:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Login:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Update Profile:
```json
{
  "name": "John Doe",
  "profile": {
    "phone": "1234567890",
    "location": "New York",
    "headline": "Software Engineer",
    "bio": "Experienced developer",
    "skills": ["JavaScript", "React", "Node.js"]
  }
}
```

### Job Application Routes
`/api/applications`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | / | Create new job application | Yes |
| GET | / | Get all applications | Yes |
| GET | /:id | Get single application | Yes |
| PUT | /:id | Update application | Yes |
| DELETE | /:id | Delete application | Yes |

#### Request Body Examples

Create Application:
```json
{
  "jobTitle": "Software Engineer",
  "companyName": "Tech Corp",
  "jobLocation": "San Francisco",
  "jobType": "Full-time",
  "salary": {
    "amount": 100000,
    "currency": "USD"
  },
  "originalJobUrl": "https://example.com/job",
  "jobDescription": "Job description here",
  "remote": true,
  "skills": ["JavaScript", "React", "Node.js"]
}
```

Update Application:
```json
{
  "status": "In Review",
  "notes": "Had first interview",
  "interviews": [{
    "type": "Technical",
    "date": "2024-05-01T10:00:00Z",
    "notes": "Technical screening"
  }]
}
```

### Query Parameters

Job Applications List:
- `status`: Filter by application status
- `company`: Filter by company name
- `sort`: Sort applications (-applicationDate for descending)

Example:
```
GET /api/applications?status=Applied&company=Tech&sort=-applicationDate
```

## Models

### User Model
- Basic Info: name, email, password
- Profile: phone, location, headline, bio, skills
- Experience and Education history
- Job preferences

### Job Application Model
- Basic Info: title, company, location, type
- Status tracking with history
- Interview scheduling
- Notes and updates
- Skills required

### Resume Model
- Multiple versions support
- PDF and DOCX formats
- Sections: education, experience, projects, skills
- Version control and notes

## Security Features

- JWT Authentication
- Request Rate Limiting
- Input Validation
- CORS Protection
- Security Headers
  - X-Content-Type-Options
  - X-Frame-Options
  - X-XSS-Protection
  - HSTS

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error message here",
  "errors": {
    "field": ["Error details"]
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Server Error

## Development

```bash
# Run in development
npm run dev

# Run tests
npm test