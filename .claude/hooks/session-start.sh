#!/bin/bash
# SessionStart hook for Horizon House
# Installs npm dependencies so the app can build/preview in Claude Code on the web.
set -euo pipefail

# Only run in the remote (Claude Code on the web) environment.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Idempotent: npm install is safe to re-run and benefits from container caching.
npm install
