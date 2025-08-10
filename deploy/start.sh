#!/bin/bash

# Bible-BE Production Start Script

set -e

echo "🚀 Starting Bible-BE Application..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    echo "📦 Activating virtual environment..."
    source venv/bin/activate
fi

# Install dependencies if needed
if [ ! -d "venv" ] || [ requirements.txt -nt venv/pyvenv.cfg ]; then
    echo "📥 Installing dependencies..."
    pip install -r requirements.txt
fi

# Initialize database if needed
echo "🗄️ Initializing database..."
python -c "
import os
import sys
sys.path.insert(0, '.')
from src.main import app, db
with app.app_context():
    db.create_all()
    print('Database initialized successfully!')
"

# Start the application
echo "🌟 Starting Bible-BE with Gunicorn..."
exec gunicorn --config gunicorn.conf.py wsgi:app

