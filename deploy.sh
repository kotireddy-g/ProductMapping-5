#!/bin/bash

set -e

DEPLOY_DIR="/var/www/product-mapping"
ZIP_FILE="product-mapping.zip"
LOG_FILE="/var/log/product-mapping-deploy.log"

echo ""
echo "---------------------------------------------------------"
echo " Starting Deployment… Sit back, relax, and have chai"
echo "---------------------------------------------------------"
echo ""

echo "Building production build... Please wait...Bro"
npm run build

echo ""
echo " Build is ready! Now packing your files into a ZIP."
rm -f $ZIP_FILE
cd build
zip -r ../$ZIP_FILE . >/dev/null
cd ..

echo ""
echo "Deploying locally.. Run Fast"
sudo mkdir -p $DEPLOY_DIR
sudo rm -rf $DEPLOY_DIR/*

sudo unzip -o $ZIP_FILE -d $DEPLOY_DIR >/dev/null

echo ""
echo "Fixing permissions... All permissions is done ..check once  "
sudo chown -R www-data:www-data $DEPLOY_DIR
sudo chmod -R 755 $DEPLOY_DIR

echo ""
echo "Restarting NGINX... Wake up bro !!!"
sudo systemctl restart nginx

echo ""
echo "Cleaning completed... cleaning payment amount is pending !!!"
rm -f $ZIP_FILE

echo ""
echo "---------------------------------------------------------"
echo "Deployment Done... Enjoy Happy Life .....don't run run again again.."
echo "deploy script is now working PERFECTLY"
echo "If you get issues... Ping me"
echo "---------------------------------------------------------"
echo ""
echo "site is live at:"
echo "http://13.204.252.47/product-mapping/"
echo ""