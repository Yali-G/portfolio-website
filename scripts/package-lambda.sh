#!/bin/bash
# Helper script to package Lambda functions for deployment
# Usage: ./scripts/package-lambda.sh

set -e

echo "📦 Packaging Lambda functions..."

# Navigate to lambda directory
cd "$(dirname "$0")/../lambda" || exit

# Remove old zip files
rm -f spotify-api.zip spotify-callback.zip strava-api.zip strava-callback.zip

# Create zip files (only include the .js files, not the directory)
zip spotify-api.zip spotify-api.js
zip spotify-callback.zip spotify-callback.js
zip strava-api.zip strava-api.js
zip strava-callback.zip strava-callback.js

echo "✅ Lambda functions packaged successfully!"
echo ""
echo "Created files:"
echo "  - lambda/spotify-api.zip"
echo "  - lambda/spotify-callback.zip"
echo "  - lambda/strava-api.zip"
echo "  - lambda/strava-callback.zip"
echo ""
echo "You can now upload these to AWS Lambda Console."

