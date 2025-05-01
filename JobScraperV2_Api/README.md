# JobGenie Backend API

## Quick Setup

1. Make sure you have Python 3.8+ installed
2. Run the setup script:
```bash
cd JobScraperV2_Api
chmod +x setup_and_test.sh
./setup_and_test.sh
```

The script will:
- Create a virtual environment
- Install dependencies
- Set up the database
- Create an admin user
- Run initial tests
- Start the development server

## Manual Setup

If you prefer to set up manually:

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Initialize database:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create admin user:
```bash
python manage.py createsuperuser
```

5. Run development server:
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- POST `/api/auth/register/` - Register new user
- POST `/api/auth/login/` - Login user
- POST `/api/auth/token/` - Get JWT token
- POST `/api/auth/token/refresh/` - Refresh JWT token

### Profile Management
- GET/PUT `/api/profiles/` - User profile management
- GET `/api/profile/completion/` - Get profile completion status

### Resume Management
- GET/POST `/api/education/` - Education entries
- GET/POST `/api/experience/` - Work experience
- GET/PUT `/api/resumes/` - Resume management
- POST `/api/resumes/{id}/latex/` - Generate LaTeX resume

### Job Applications
- GET/POST `/api/applications/` - Job applications
- PUT `/api/applications/{id}/status/` - Update application status

### Preferences
- GET/PUT `/api/preferences/` - Job preferences
- PUT `/api/preferences/update/` - Update job preferences

## Testing

Run the test script to verify API functionality:
```bash
python test_setup.py
```

## Admin Interface

Access the admin interface at: http://localhost:8000/admin
- Default admin username: admin
- Default admin password: admin123

## Development

The API uses:
- SQLite for development database
- JWT for authentication
- Custom JSONField for array storage
- CORS configuration for frontend integration

## Frontend Integration

Update your frontend API configuration to point to:
```
http://localhost:8000/api
```

Make sure to include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Notes

- This is a development setup. For production:
  - Change DEBUG to False
  - Use a proper database (PostgreSQL recommended)
  - Set proper SECRET_KEY
  - Configure proper CORS settings
  - Set up proper static/media file handling
  - Use HTTPS
