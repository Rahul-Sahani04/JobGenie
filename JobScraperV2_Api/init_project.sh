#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing Django Project...${NC}"

# Current directory should be JobScraperV2_Api
PROJECT_DIR=$(pwd)

# Create and activate virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Creating virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate

# Install requirements
echo -e "${YELLOW}Installing requirements...${NC}"
pip install -r requirements.txt

# Move Django files to correct location
echo -e "${YELLOW}Setting up project structure...${NC}"

# Create necessary directories if they don't exist
mkdir -p media
mkdir -p static

# Move files from backend/ to project root if they exist
if [ -d "backend" ]; then
    mv backend/* .
    rm -rf backend
fi

# Ensure correct module paths
sed -i '' 's/backend\./JobScraperV2_Api./g' manage.py
sed -i '' 's/backend\./JobScraperV2_Api./g' settings.py
sed -i '' 's/backend\./JobScraperV2_Api./g' wsgi.py
sed -i '' 's/backend\./JobScraperV2_Api./g' asgi.py

# Make manage.py executable
chmod +x manage.py

# Initialize database
echo -e "${YELLOW}Initializing database...${NC}"
python3 manage.py makemigrations
python3 manage.py migrate

# Create superuser if it doesn't exist
echo -e "${YELLOW}Creating superuser...${NC}"
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell

echo -e "${GREEN}Django project initialized!${NC}"
echo -e "To start development server:"
echo -e "${YELLOW}1. source venv/bin/activate${NC}"
echo -e "${YELLOW}2. python manage.py runserver${NC}"
echo -e "\nAdmin credentials:"
echo -e "Username: ${YELLOW}admin${NC}"
echo -e "Password: ${YELLOW}admin123${NC}"
echo -e "\nAPI will be available at: ${YELLOW}http://localhost:8000/api/${NC}"
echo -e "Admin interface at: ${YELLOW}http://localhost:8000/admin/${NC}"