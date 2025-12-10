#!/bin/bash

# Install terser if not already installed
if ! command -v terser &> /dev/null; then
    npm install -g terser
fi

# Minify your JavaScript files
terser script-min.js -o script-minified.js -c -m

echo "✓ JavaScript files minified successfully!"