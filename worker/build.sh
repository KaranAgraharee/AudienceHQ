#!/bin/bash
# Build script for Render deployment

# Install dependencies from inboxai directory first
echo "Installing inboxai dependencies..."
cd ../inboxai && npm install

# Return to worker directory and install worker dependencies
echo "Installing worker dependencies..."
cd ../worker && npm install

echo "Build complete!"

