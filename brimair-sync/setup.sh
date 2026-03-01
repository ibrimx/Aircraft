#!/bin/bash
set -e
echo "🚀 Setting up Aircraft Sync..."

if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Created .env — please fill in your tokens"
  echo "   1. GITHUB_TOKEN: github.com/settings/tokens → Generate new token (classic) → scope: repo"
  echo "   2. NOTION_API_KEY: notion.so/my-integrations → New Integration → copy token"
  echo "   3. NOTION_DB_ID: Open PR Tracker in browser → copy ID from URL"
  echo ""
  echo "⚠️  After filling .env, run: npm run sync"
  exit 0
fi

echo "📦 Installing dependencies..."
npm install

echo "🔄 Running first sync..."
npx tsx sync.ts

echo "✅ Done!"
