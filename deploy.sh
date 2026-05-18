#!/bin/bash
set -e

# ==========================================
# Kesurved Herbal - VM Update & Deploy Script
# ==========================================
# Run this script on your VM to pull the latest code,
# sync the new database fields, build the app, and restart.

echo "🚀 Starting update for Kesurved Herbal..."

# 1. Force pull the latest code from Git (overwrites local changes on VM)
echo "📥 Fetching and pulling latest code..."
git fetch origin main
git reset --hard origin/main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Generate Prisma Client and Sync Database
# This is CRITICAL to apply schema changes like the new SKU and OrderNumber fields.
echo "🗄️ Generating Prisma Client and Syncing Database..."
npx prisma generate
npx prisma db push --accept-data-loss

# 4. Build the Next.js production bundle
echo "🏗️ Building the Next.js application..."
npm run build

# 5. Restart the application using PM2
echo "🔄 Restarting the PM2 process..."
pm2 restart kesurved-app || pm2 start npm --name "kesurved-app" -- start

echo "✅ Update successful! The app is live with all new features."
