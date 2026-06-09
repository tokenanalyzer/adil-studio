---
name: Adil Studio Project Constraints
description: Critical constraints for the adil-studio artifact
---

## Constraints
- `.migration-backup/` is the authoritative Next.js 16 App Router source. NEVER convert to Vite.
- Workflow: `cd /home/runner/workspace/.migration-backup && pnpm run dev`
- Port: 20354 (set via PORT env in artifact.toml)
- Supabase env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY (set)
- Nav.tsx MUST be "use client" — it dispatches window events to trigger IntakeModal
- Contact page at /contact with real submitLead server action exists
- `integratedSkills` block in artifact.toml must be preserved

## Why
Previous session established migration-backup as the source after a full migration. The artifact.toml points to migration-backup. Converting to Vite or rebuilding schema would break the CMS.

## How to apply
Always edit files inside `.migration-backup/src/`. Never touch `artifacts/adil-studio/` source code directly unless configuring the artifact metadata.
