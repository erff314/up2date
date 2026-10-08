<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# Project Context: Modular Digital Newspaper Platform ("up2date")

## 1. Project Overview
A modular, full-stack web application for digital newspapers featuring an issue-based publishing workflow, strict role-based access control (RBAC), and dynamic feature modules (on/off toggles).

## 2. Tech Stack & Core Libraries
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, Lucide Icons
- **Database & ORM:** PostgreSQL, Prisma ORM
- **Rich-Text Editor:** TipTap (ProseMirror-based editor for structured content and revision tracking)
- **Authentication:** NextAuth.js / Auth.js (Role-based route protection)
- **Deployment:** Vercel

## 3. Core Roles & Editorial State Machine
The system relies on strict Role-Based Access Control (`READER`, `AUTHOR`, `PROOFREADER`, `EDITOR`, `ADMIN`).

### Article State Machine
`DRAFT` (Author creates) 
  ↳ `IN_REVIEW` (Proofreader edits text & adds inline feedback) 
      ↳ `APPROVED` (Editor approves revision) 
          ↳ `PUBLISHED` (Live on homepage or scheduled batch release)

## 4. Mandatory HTML5 Forms Matrix (7 Forms Target)
All forms must be fully functional and connected to the Prisma/PostgreSQL backend:
1. **FORM-01 (Auth & Profiling):** Login, registration, role selection.
2. **FORM-02 (Article Editor):** Rich-text drafting, main image upload, metadata tagging.
3. **FORM-03 (Proofreading Mask):** Revision editor, editorial notes field, status approval trigger.
4. **FORM-04 (Admin Panel):** Dynamic module ON/OFF toggles, release scheduling (instant live vs. scheduled date).
5. **FORM-05 (Podcast Uploader):** MP3 file upload, episode title, description, show notes.
6. **FORM-06 (Interaction Center):** Reader comments below articles, global search & filter bar.
7. **FORM-07 (Calendar Manager):** Event creation (birthdays, editorial deadlines, team gatherings) with date picker and tags.

## 5. Feature Modules Specification
- **Photo Frame & Gallery:** Dynamic hero frame linking to a full lightbox gallery page.
- **Podcast Player & Archive:** Audio player widget for the latest episode + dedicated episode archive.
- **Team Hub & Profiles:** Detailed member cards, bio, linked written articles, birthday badges.
- **Event Calendar:** Interactive monthly schedule with color-coded categories (Deadlines, Birthdays, Events).
- **Live Reporter Map:** Interactive location map (using Leaflet.js / OpenStreetMap) with contact cards.
- **PDF Print Generator:** Auto-generated print-ready PDF layout (`@media print` optimized) for analogue/senior readers.

## 6. Directory Conventions
- `src/app/(public)/`: Public reader routes (Homepage, Article Details, Gallery, Map, Calendar).
- `src/app/(editorial)/`: Restricted workflows (Editor, Proofreading Mask, Article Submission).
- `src/app/admin/`: Unified Admin Panel for feature toggles and scheduling.
- `src/components/ui/`: Reusable UI primitives (Buttons, Modals, Forms).
- `src/components/modules/`: Isolated feature modules (`calendar/`, `podcast/`, `map/`, `pdf-export/`).
- `prisma/`: Database schema, seeds, and migrations.

## 7. Guidelines for AI Agents
- Always enforce strict TypeScript types (no `any`).
- Use Server Components for data fetching and Server Actions for form submissions/mutations.
- Validate all incoming form inputs using Zod schemas before database insertion.
- Keep HTML standards strict and clean to ensure compliance with W3C validation.

<!-- END:nextjs-agent-rules -->
