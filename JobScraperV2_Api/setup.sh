#!/bin/bash

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python3 is not installed. Please install Python3 first."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing requirements..."
pip install -r requirements.txt

# Make manage.py executable
chmod +x manage.py

# Initialize database
echo "Initializing database..."
python manage.py makemigrations
python manage.py migrate

# Create superuser
echo "Creating superuser..."
python manage.py createsuperuser

# Final instructions
echo "
Setup completed!

To run the server:
1. Activate virtual environment:
   source venv/bin/activate

2. Start server:
   python3 manage.py runserver

The API will be available at http://localhost:8000/api/

Access admin panel at http://localhost:8000/admin/
"