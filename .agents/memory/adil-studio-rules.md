---
name: Adil Studio project rules
description: Durable constraints and decisions for the Adil Studio Next.js project
---

**Source of truth:** `.migration-backup/` is the authoritative codebase. Do not switch branches or pull alternative versions without explicit user approval.

**Framework:** Next.js App Router (`next@^16.2.7`). Do NOT convert to Vite or any other framework.

**Master Handover Document rule:** No schema changes, no rebuilds of CMS/Auth/DB/Supabase unless a verified runtime bug requires it.

**Supabase:** Existing project — do NOT create a new Supabase project. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`. Owner adds them to Replit Secrets.

**Admin auth:** HTTP Basic Auth via `middleware.ts` is the working auth layer. Supabase Auth stubs (`get-user.ts`, `is-admin.ts`, `require-admin.ts`) return null/false — not yet implemented.

**Why:** `user_roles` and `founder_profile` tables are referenced in RLS migrations but not yet created and not referenced in any app code — defer until auth phase.

**Batch 1 bugs fixed:** `studio_variants` (was "variants"), `portfolio_items` (was "portfolio"), `site_settings` (was "settings"), `services.title` (was `name`).

**Route group:** All admin CMS pages now live inside `src/app/(admin)/admin/` and inherit `AdminLayout` with nav links.

**Next phases:** A=Website Polish (awaiting brand assets from owner), B=Adi AI Phase 3, C=Production Readiness.
