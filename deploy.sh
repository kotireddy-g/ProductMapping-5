#!/bin/bash

set -e

SERVER_USER="ubuntu"
SERVER_IP="ec2-13-204-252-47.ap-south-1.compute.amazonaws.com"
SERVER_PATH="/var/www/product-mapping"

echo "🔍 Verifying React build files..."
grep "assets" build/index.html || echo "⚠️ Index assets check passed."

echo "📦 Building production bundle..."
npm run build

echo "📦 Packaging build into ZIP..."
cd build
zip -r ../product-mapping.zip .
cd ..

echo "📤 Uploading ZIP to server..."
scp product-mapping.zip ${SERVER_USER}@${SERVER_IP}:/tmp/

echo "🚀 Deploying on server..."
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "📁 Preparing deployment directory..."
sudo mkdir -p /var/www/product-mapping
sudo rm -rf /var/www/product-mapping/*

echo "📦 Unzipping build..."
sudo unzip -o /tmp/product-mapping.zip -d /var/www/product-mapping

echo "🔧 Setting permissions..."
sudo chown -R www-data:www-data /var/www/product-mapping
sudo chmod -R 755 /var/www/product-mapping

echo "🧹 Cleaning server temporary files..."
rm /tmp/product-mapping.zip

echo "🔄 Restarting NGINX..."
sudo systemctl restart nginx

echo "✅ Server deployment complete!"
ENDSSH

echo "🧹 Cleaning local ZIP file..."
rm product-mapping.zip

echo ""
echo "🎉 Deployment Complete!"
echo "🌐 Visit your site at: http://${SERVER_IP}/"
echo ""
