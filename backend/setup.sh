#!/bin/bash
echo "=== TaskFlow Backend Setup ==="

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example - please update SECRET_KEY"
fi

# Run migrations
python manage.py makemigrations authentication
python manage.py makemigrations tasks
python manage.py migrate

echo "=== Setup Complete ==="
echo "Run: python manage.py runserver"
