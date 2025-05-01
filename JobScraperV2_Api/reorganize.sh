#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Reorganizing Django project structure...${NC}"

# Create necessary directories if they don't exist
mkdir -p migrations
mkdir -p static
mkdir -p media
mkdir -p templates

# Ensure __init__.py exists in migrations
touch migrations/__init__.py

# Create a temporary backup of the current files
echo -e "${YELLOW}Creating backup of existing files...${NC}"
mkdir -p backup
cp *.py backup/

# Update settings.py INSTALLED_APPS
sed -i '' 's/JobScraperV2_Api.apps.JobscraperConfig/JobScraperV2_Api/g' settings.py

# Update paths in manage.py
sed -i '' 's/backend.settings/JobScraperV2_Api.settings/g' manage.py
sed -i '' 's/config.settings/JobScraperV2_Api.settings/g' manage.py

# Create new apps.py if it doesn't exist
if [ ! -f "apps.py" ]; then
    echo "from django.apps import AppConfig

class JobscraperConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'JobScraperV2_Api'

    def ready(self):
        import JobScraperV2_Api.signals" > apps.py
fi

# Update directory structure
echo -e "${YELLOW}Updating directory structure...${NC}"

# Ensure all Python files have correct imports
for file in *.py; do
    if [ -f "$file" ]; then
        sed -i '' 's/from backend\./from JobScraperV2_Api./g' "$file"
        sed -i '' 's/from config\./from JobScraperV2_Api./g' "$file"
    fi
done

# Make manage.py executable
chmod +x manage.py

# Create empty __init__.py files in all directories
find . -type d -exec touch {}/__init__.py \;

echo -e "${GREEN}Project structure reorganized!${NC}"
echo -e "Next steps:"
echo -e "${YELLOW}1. python manage.py makemigrations${NC}"
echo -e "${YELLOW}2. python manage.py migrate${NC}"
echo -e "${YELLOW}3. python manage.py runserver${NC}"

# Clean up backup if everything succeeded
if [ $? -eq 0 ]; then
    rm -rf backup
    echo -e "${GREEN}Cleanup completed successfully${NC}"
else
    echo -e "${RED}An error occurred. Backup files are in the 'backup' directory${NC}"
fi