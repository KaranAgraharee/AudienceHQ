#!/bin/bash
# Start script that sets up NODE_PATH for module resolution

# Set NODE_PATH to include both worker and inboxai node_modules
export NODE_PATH="${NODE_PATH}:$(pwd)/node_modules:$(pwd)/../inboxai/node_modules"

# Run the worker
npm run worker

