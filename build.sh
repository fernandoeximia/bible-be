#!/bin/bash

# Bible-BE Build Script

set -e

echo "🔨 Building Bible-BE Application..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/ dist/ *.egg-info/

# Create build directory
mkdir -p build

# Copy source files
echo "📁 Copying source files..."
cp -r src/ build/
cp -r static/ build/
cp -r database/ build/
cp requirements.txt build/
cp wsgi.py build/
cp gunicorn.conf.py build/
cp .env build/
cp start.sh build/

# Build frontend if needed
if [ -d "frontend" ]; then
    echo "🎨 Building frontend..."
    cd frontend
    if [ -f "package.json" ]; then
        npm install
        npm run build
        cp -r dist/* ../build/static/
    fi
    cd ..
fi

# Create production requirements
echo "📦 Creating production requirements..."
cat > build/requirements-prod.txt << EOF
flask==3.1.1
flask-sqlalchemy==3.1.1
flask-cors==6.0.1
gunicorn==23.0.0
python-dotenv==1.1.1
EOF

# Create deployment package
echo "📦 Creating deployment package..."
cd build
tar -czf ../bible-be-production.tar.gz .
cd ..

echo "✅ Build completed successfully!"
echo "📦 Production package: bible-be-production.tar.gz"
echo "🚀 Ready for deployment!"

# Show build info
echo ""
echo "📊 Build Information:"
echo "   - Package size: $(du -h bible-be-production.tar.gz | cut -f1)"
echo "   - Build date: $(date)"
echo "   - Files included: $(tar -tzf bible-be-production.tar.gz | wc -l) files"

