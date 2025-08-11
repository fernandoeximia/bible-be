# Bible-BE Production Build

## 📦 Build Information

- **Build Date:** $(date)
- **Package Size:** $(du -h bible-be-production.tar.gz | cut -f1)
- **Files Included:** $(tar -tzf bible-be-production.tar.gz | wc -l) files
- **Python Version:** $(python --version)
- **Flask Version:** 3.1.1

## 🚀 Deployment Instructions

### Quick Start
```bash
# Extract the build
tar -xzf bible-be-production.tar.gz
cd build/

# Install dependencies
pip install -r requirements-prod.txt

# Start the application
./start.sh
```

### Using Gunicorn (Recommended)
```bash
gunicorn --config gunicorn.conf.py wsgi:app
```

### Using Docker
```bash
docker build -t bible-be .
docker run -p 5000:5000 bible-be
```

## 🔧 Configuration

- **Environment:** Production
- **Database:** SQLite (included)
- **Static Files:** Included in build
- **CORS:** Enabled for all origins

## 📋 Features Included

- ✅ Complete Bible content (66 books, NVI)
- ✅ Search by reference (e.g., João 3:16)
- ✅ Functional sidebar navigation
- ✅ Responsive React frontend
- ✅ Flask backend with complete APIs
- ✅ Annotation system ready
- ✅ Health check endpoint

## 🌐 Endpoints

- `GET /` - Frontend application
- `GET /health` - Health check
- `GET /api/books` - List all books
- `GET /api/search/reference` - Search by reference
- `GET /api/books/{id}/chapters` - Get book chapters
- `GET /api/chapters/{id}/verses` - Get chapter verses

## 📊 Performance

- **Workers:** 4 (configurable)
- **Timeout:** 30 seconds
- **Max Requests:** 1000 per worker
- **Memory:** ~50MB base usage

