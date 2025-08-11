#!/usr/bin/env python3
"""
WSGI entry point for Bible-BE application
"""
import os
import sys

# Add the project directory to Python path
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)

# Import the Flask application
from src.main import app

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=False)

