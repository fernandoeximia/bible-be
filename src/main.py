import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from src.models.bible import db
from src.routes.bible import bible_bp
from src.routes.annotations import annotations_bp
from src.routes.search import search_bp

# Configure static folder path - use absolute path
static_folder_path = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static'))
app = Flask(__name__, static_folder=static_folder_path, static_url_path='/static')
app.config['SECRET_KEY'] = 'bible-be-secret-key-2025'

# Enable CORS for all routes
CORS(app, origins="*")

# Register blueprints
app.register_blueprint(bible_bp, url_prefix='/api')
app.register_blueprint(annotations_bp, url_prefix='/api')
app.register_blueprint(search_bp, url_prefix='/api')

# Database configuration - use in-memory for deployment
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bible.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Initialize database
with app.app_context():
    db.create_all()

@app.route('/')
def serve_index():
    """Serve the main index.html file"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/static/<path:filename>')
def serve_static_files(filename):
    """Serve static files (CSS, JS, etc.)"""
    return send_from_directory(app.static_folder, filename)

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    """Serve asset files from assets directory"""
    assets_path = os.path.join(app.static_folder, 'assets')
    return send_from_directory(assets_path, filename)

@app.route('/<path:path>')
def serve_spa(path):
    """Serve SPA routes - return index.html for client-side routing"""
    # If it's an API route, return 404
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    
    # For all other routes, serve index.html (SPA routing)
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/health')
def health_check():
    return {"status": "healthy", "service": "Bible-BE API"}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

