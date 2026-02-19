#!/bin/bash
# Deployment script for Hospital Pharmacy OTIF Application
# Deploys to: http://demo.sg.xflow.prod/product-mapping/

echo "🚀 Starting deployment for Product Mapping Application..."

# Navigate to project directory
cd "/Users/exflow_koti_air/Downloads/ProductMapping 5"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build

# Build the application
echo "📦 Building application..."
npm run build

# Verify base path is correct
echo "✅ Verifying base path..."
grep "assets" build/index.html
# Should show: /product-mapping/assets/...

# Package the build
echo "📦 Packaging build..."
cd build
zip -r ../product-mapping.zip .
cd ..

# Upload to server
echo "📤 Uploading to server..."
scp product-mapping.zip ubuntu@demo.sg.xflow.prod:/tmp/

# Deploy on server
echo "🚀 Deploying on server..."
ssh ubuntu@demo.sg.xflow.prod << 'ENDSSH'
cd /var/www/html
sudo rm -rf product-mapping/*
sudo unzip -o /tmp/product-mapping.zip -d product-mapping
sudo chown -R www-data:www-data product-mapping
sudo chmod -R 755 product-mapping
rm /tmp/product-mapping.zip
ENDSSH

# Clean up local zip
echo "🧹 Cleaning up..."
rm product-mapping.zip

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Visit: http://demo.sg.xflow.prod/product-mapping/"
echo ""
echo "📝 Login credentials:"
echo "   Email: admin@experienceflow.ai"
echo "   Password: xFlow@321"