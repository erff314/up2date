<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Project Context: Modular Digital Newspaper Platform ("up2date")

## 1. Project Overview
A modular, full-stack multi-tenant web application and platform for private digital newspapers. Designed specifically for closed groups (clubs, sports teams, school classes, families, organizations, internal team circles) to create, host, edit, and publish their own private digital newspapers with an issue-based publishing workflow, role-based access control, and dynamic feature modules (on/off toggles).

## 2. Core Vision & Multi-Tenancy Architecture
- **Multi-Tenant Platform (Private Group Newspapers):**
  The platform hosts multiple distinct newspaper instances ("Tenants" / "Publications"). Any registered user can create one or multiple private newspapers for their groups.
- **Strict Private / Closed-Group Access:**
  Every newspaper is strictly private and accessible only to invited group members (via invite links/codes or member login). Generic public websites are explicitly out of scope — this platform is not a website builder, but a focused digital newspaper hub for private communities.
- **Tenant-Scoped Role-Based Access Control (RBAC):**
  Roles are scoped to each specific newspaper (`READER`, `PROOFREADER`, `EDITOR`, `ADMIN`). A user may be an `ADMIN` in Newspaper A and a `READER` in Newspaper B.
- **Tenant-Scoped Feature Toggles:**
  Each newspaper dynamically toggles modules on/off for its own publication (e.g., Podcast Module enabled for Newspaper A, disabled for Newspaper B).
- **Central Hosting & Data Isolation:**
  All newspapers are hosted and managed centrally on the platform with strict data isolation per tenant (articles, revisions, media, calendars, comments, and member rosters).

## 3. Tech Stack & Core Libraries
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & ORM:** PostgreSQL, Prisma ORM (Multi-tenant data models with tenant scoping)
- **Rich-Text Editor:** TipTap (ProseMirror-based editor for structured content and revision tracking)
- **Authentication:** NextAuth.js / Auth.js (Session management with tenant-specific RBAC route protection)
- **Deployment:** Vercel

## 4. Core Roles & Editorial State Machine
Within each newspaper, the system enforces strict Role-Based Access Control:
- `READER`: Reads the private newspaper, listens to podcasts, leaves comments, views member list/calendar.
- `PROOFREADER`: Proofreads drafts, edits text, and provides inline feedback/editorial notes.
- `EDITOR`: Writes, edits, refines, and approves articles for publication (merges author & editorial responsibilities).
- `ADMIN`: Manages newspaper settings, member invites, role assignments, feature toggles, and issue releases.
- *(Platform level: `SUPERADMIN`)*

### Article State Machine (Per Newspaper)
`DRAFT` (Editor creates/edits) 
  ↳ `IN_REVIEW` (Proofreader reviews text & adds inline feedback) 
      ↳ `APPROVED` (Editor approves final revision) 
          ↳ `PUBLISHED` (Live on private newspaper frontpage or scheduled batch release)

## 5. Mandatory HTML5 Forms Matrix
All forms must be fully functional and connected to the Prisma/PostgreSQL backend:
1. **FORM-01 (Auth, Profiling & Tenant Creation):** Login, registration, private newspaper creation & member invite management.
2. **FORM-02 (Article Editor):** Rich-text drafting (TipTap), main image upload, metadata tagging, tenant assignment.
3. **FORM-03 (Proofreading Mask):** Revision editor, editorial notes field, status approval trigger.
4. **FORM-04 (Admin & Tenant Panel):** Dynamic module ON/OFF toggles per newspaper, release scheduling (instant live vs. scheduled date), invite link/code management.
5. **FORM-05 (Podcast Uploader):** MP3 file upload, episode title, description, show notes.
6. **FORM-06 (Interaction Center):** Member comments below articles, global search & filter bar.
7. **FORM-07 (Calendar Manager):** Event creation (birthdays, editorial deadlines, team gatherings) with date picker and tags.

## 6. Feature Modules Specification (Configurable Per Newspaper)
- **Photo Frame & Gallery:** Dynamic hero frame linking to a full lightbox gallery page.
- **Podcast Player & Archive:** Audio player widget for the latest episode + dedicated episode archive.
- **Team Hub & Profiles:** Detailed member cards, bio, linked written articles, birthday badges.
- **Event Calendar:** Interactive monthly schedule with color-coded categories (Deadlines, Birthdays, Events).
- **Live Reporter Map:** Interactive location map (using Leaflet.js / OpenStreetMap) with contact cards.
- **PDF Print Generator:** Auto-generated print-ready PDF layout (`@media print` optimized) for analogue/senior readers.

## 7. Directory Conventions
- `src/app/(platform)/`: Landing page, newspaper creation wizard, global user dashboard.
- `src/app/[newspaperSlug]/(reader)/`: Private reader/member routes for a specific newspaper (Homepage, Article Details, Gallery, Map, Calendar).
- `src/app/[newspaperSlug]/(editorial)/`: Restricted editorial workflows (Article Editor, Proofreading Mask, Submissions).
- `src/app/[newspaperSlug]/admin/`: Tenant Admin Panel for per-newspaper feature toggles, membership/invite management, and release scheduling.
- `src/components/ui/`: Reusable UI primitives (Buttons, Modals, Forms).
- `src/components/modules/`: Isolated feature modules (`calendar/`, `podcast/`, `map/`, `pdf-export/`).
- `prisma/`: Multi-tenant database schema, seeds, and migrations.

## 8. Guidelines for AI Agents
- Always enforce strict TypeScript types (no `any`).
- Use Server Components for data fetching and Server Actions for form submissions/mutations.
- Ensure strict tenant isolation: every query/mutation must respect and enforce `newspaperId` / `newspaperSlug` validation.
- Validate all incoming form inputs using Zod schemas before database insertion.
- Keep HTML standards strict and clean to ensure compliance with W3C validation.

<!-- END:nextjs-agent-rules -->
