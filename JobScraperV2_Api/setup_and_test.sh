#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting JobGenie Backend Setup...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "\n${YELLOW}Creating virtual environment...${NC}"
    python -m venv venv
fi

# Activate virtual environment
echo -e "\n${YELLOW}Activating virtual environment...${NC}"
source venv/bin/activate

# Install requirements
echo -e "\n${YELLOW}Installing requirements...${NC}"
pip install -r requirements.txt
pip install requests # For testing script

# Make manage.py executable
chmod +x manage.py

# Remove old database and migrations
echo -e "\n${YELLOW}Cleaning up old database and migrations...${NC}"
find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
find . -path "*/migrations/*.pyc" -delete
rm -f db.sqlite3

# Initialize database
echo -e "\n${YELLOW}Initializing database...${NC}"
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo -e "\n${YELLOW}Creating superuser...${NC}"
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123')" | python manage.py shell

# Start server in background
echo -e "\n${YELLOW}Starting Django server...${NC}"
python manage.py runserver &
SERVER_PID=$!

# Wait for server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 5

# Run test script
echo -e "\n${YELLOW}Running tests...${NC}"
python test_setup.py

# Stop server
echo -e "\n${YELLOW}Stopping server...${NC}"
kill $SERVER_PID

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "You can now start the server with: ${YELLOW}python manage.py runserver${NC}"
echo -e "Admin credentials: username=${YELLOW}admin${NC}, password=${YELLOW}admin123${NC}"
echo -e "Admin panel: ${YELLOW}http://localhost:8000/admin${NC}"
echo -e "API endpoint: ${YELLOW}http://localhost:8000/api${NC}"