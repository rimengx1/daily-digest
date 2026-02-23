#!/bin/bash
# Deploy RSS backend to Vercel

echo "🚀 Deploying xyan.xin RSS Backend to Vercel..."

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Go to rss-backend directory
cd "$(dirname "$0")/rss-backend"

# Deploy to Vercel
echo "📦 Deploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "Remember to update your frontend .env with the new API URL"
