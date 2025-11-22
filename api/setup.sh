#!/bin/bash

echo "🚀 Setting up HamzaIG Contact Form API..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure the .env file exists with your credentials"
echo "2. Start the server with: npm start"
echo "3. For development with auto-reload: npm run dev"
echo ""
echo "🌐 The API will be available at: http://localhost:3000"
echo "📧 Make sure to update the API URL in index.html for production"

