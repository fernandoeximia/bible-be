# Bible-BE Production Deployment

## 📦 Deployment Package

- **Backend Build:** bible-be-production.tar.gz (116KB)
- **Frontend Build:** bible-be-frontend-build.tar.gz (86KB)
- **Combined Size:** 202KB total
- **Deploy Date:** $(date)

## 🚀 Deployment Structure

```
deploy/
├── src/                    # Backend source code
│   ├── main.py            # Flask application
│   ├── models/            # Database models
│   └── routes/            # API routes
├── static/                # Frontend build
│   ├── index.html         # Main HTML file
│   ├── favicon.ico        # App icon
│   └── assets/            # CSS, JS, images
├── database/              # SQLite database
├── wsgi.py               # WSGI entry point
├── gunicorn.conf.py      # Gunicorn configuration
├── requirements.txt      # Python dependencies
├── .env                  # Environment variables
└── start.sh             # Startup script
```

## ✅ Features Included

### **Backend (Flask)**
- ✅ Complete Bible content (66 books, NVI)
- ✅ Search by reference API
- ✅ Book navigation API
- ✅ Annotation system API
- ✅ Health check endpoint
- ✅ CORS enabled
- ✅ SQLite database included

### **Frontend (React)**
- ✅ Responsive design
- ✅ Modern React 19 components
- ✅ Tailwind CSS styling
- ✅ Radix UI components
- ✅ Search functionality
- ✅ Sidebar navigation
- ✅ Annotation interface

## 🔧 Production Configuration

### **Gunicorn Settings**
- **Workers:** 4 processes
- **Bind:** 0.0.0.0:5000
- **Timeout:** 30 seconds
- **Max requests:** 1000 per worker

### **Environment**
- **Flask Environment:** Production
- **Debug Mode:** Disabled
- **Database:** SQLite (included)
- **Static Files:** Optimized build

## 🌐 API Endpoints

- `GET /` - Frontend application
- `GET /health` - Health check
- `GET /api/books` - List all books
- `GET /api/search/reference?ref=João 3:16` - Search by reference
- `GET /api/books/{id}/chapters` - Get book chapters
- `GET /api/chapters/{id}/verses` - Get chapter verses
- `POST /api/annotations` - Create annotation
- `GET /api/annotations` - List annotations

## 📊 Performance Optimizations

### **Frontend**
- **Gzipped assets:** ~70% size reduction
- **Code splitting:** Vendor, UI, Utils chunks
- **Minification:** ESBuild optimization
- **Caching:** Fingerprinted assets

### **Backend**
- **Database:** Indexed queries
- **CORS:** Optimized headers
- **Static serving:** Efficient file serving
- **Memory:** ~50MB base usage

## 🚀 Deployment Commands

### **Quick Start**
```bash
# Install dependencies
pip install -r requirements-prod.txt

# Start application
./start.sh
```

### **Manual Start**
```bash
# Using Gunicorn (recommended)
gunicorn --config gunicorn.conf.py wsgi:app

# Using Flask dev server (not recommended for production)
python wsgi.py
```

### **Docker Deployment**
```bash
# Build image
docker build -t bible-be .

# Run container
docker run -p 5000:5000 bible-be
```

## 🔍 Health Check

```bash
curl http://localhost:5000/health
# Expected response:
# {"service":"Bible-BE API","status":"healthy"}
```

## 📱 Browser Support

- ✅ Chrome/Edge 88+
- ✅ Firefox 78+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS 14+, Android 10+)

**Ready for production deployment!** 🎯

