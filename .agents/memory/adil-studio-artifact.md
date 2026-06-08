---
name: Adil Studio artifact wiring
description: How the Next.js app in .migration-backup/ is wired to the Replit artifact system
---

## The Run Command
`artifacts/adil-studio/.replit-artifact/artifact.toml` dev run must be:
```
cd /home/runner/workspace/.migration-backup && pnpm run dev
```

Next.js 16 reads the `PORT` env var natively. The artifact system injects `PORT=20354`.

## integratedSkills constraint
`verifyAndReplaceArtifactToml` rejects any toml that removes the `[[integratedSkills]]` block. Always keep it in the temp file even though this is a Next.js app, not a react-vite scaffold.

## Deps
`.migration-backup/node_modules` has `next@16.2.7` already installed.
Running `pnpm install` from inside `.migration-backup/` bubbles to the workspace root and does NOT install local deps. Use `npm install --legacy-peer-deps` instead if a fresh install is needed.

**Why:** `.migration-backup/` is a sibling directory under the workspace root, so pnpm finds `pnpm-workspace.yaml` at the root and treats it as a monorepo operation.

## Deprecation warning (non-blocking)
Next.js 16 logs: `⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.`
The admin basic-auth middleware still works. Migration to the "proxy" convention is Phase B work.
