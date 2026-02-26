# Brimair Sync

Syncs GitHub Pull Requests from `ibrimx/Brimair` (targeting `main`) into a Notion PR Tracker database.

## Setup

1. **Create tokens and IDs**
   - GitHub classic token with `repo` scope
   - Notion integration token
   - Notion database ID for your PR Tracker
2. **Create and fill `.env`**
   - Copy `.env.example` to `.env`
   - Fill the five variables with real values
3. **Install and run sync**
   - `npm install`
   - `npm run sync`

## Branch naming convention

Use branches in this format so prompt numbers can be detected:

- `prompt/XX-description`
- Example: `prompt/7-auth-model`

## Available commands

- `npm run sync` — run a one-time sync
- `npm run sync:watch` — run via tsx watch mode during development

## Cron setup

Run every 10 minutes from this folder:

```bash
*/10 * * * * cd /path/to/Brimair/brimair-sync && /usr/bin/env bash -lc 'npm run sync >> sync.log 2>&1'
```

1. Run `crontab -e`
2. Paste the cron line above with your real path
3. Save and verify log output in `sync.log`

## Git hook setup (post-push)

From the repository root (`/workspace/Brimair`):

```bash
cat > .git/hooks/post-push <<'HOOK'
#!/bin/bash
cd "$(git rev-parse --show-toplevel)/brimair-sync" || exit 0
npm run sync
HOOK
chmod +x .git/hooks/post-push
```

Now every `git push` triggers a sync run.
