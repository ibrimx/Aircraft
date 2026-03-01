# Aircraft Sync

Syncs GitHub Pull Requests from `ibrimx/Aircraft` (targeting `main`) into a Notion PR Tracker database.

## Setup

1. **Create tokens and IDs**
   - GitHub token with `repo` scope
   - Notion integration token
   - Notion database ID for your PR Tracker
2. **Set environment variables**
   - `GITHUB_TOKEN`
   - `GITHUB_OWNER`
   - `GITHUB_REPO`
   - `NOTION_API_KEY`
   - `NOTION_DB_ID`
3. **Run sync**
   - `node sync.mjs`

This script has zero runtime dependencies and only uses built-in Node.js `fetch()`.

## Branch naming convention

Use branches in this format so prompt numbers can be detected:

- `prompt/XX-description`
- Example: `prompt/7-auth-model`

## Available commands

- `npm run sync` — run a one-time sync (`node sync.mjs`)
- `npm run sync:watch` — run with Node watch mode during development

## Cron setup

Run every 10 minutes from this folder:

```bash
*/10 * * * * cd /path/to/Aircraft/aircraft-sync && /usr/bin/env bash -lc 'node sync.mjs >> sync.log 2>&1'
```

1. Run `crontab -e`
2. Paste the cron line above with your real path
3. Save and verify log output in `sync.log`

## Git hook setup (post-push)

From the repository root (`/workspace/Aircraft`):

```bash
cat > .git/hooks/post-push <<'HOOK'
#!/bin/bash
cd "$(git rev-parse --show-toplevel)/aircraft-sync" || exit 0
node sync.mjs
HOOK
chmod +x .git/hooks/post-push
```

Now every `git push` triggers a sync run.
