#!/usr/bin/env bash
set -euo pipefail

corepack enable >/dev/null 2>&1 || true
corepack prepare pnpm@9.15.9 --activate

pnpm install
