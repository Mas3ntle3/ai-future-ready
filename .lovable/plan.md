# AI Community Computer Learning Assistant — Build Plan

A modern blue/white web app helping young Gauteng residents apply for free computer literacy classes, powered by Lovable AI.

## Stack & infrastructure
- TanStack Start (existing scaffold) + Tailwind v4 + shadcn/ui
- Lovable Cloud (auth + database) for saved applications, CVs, cover letters
- Lovable AI Gateway (`google/gemini-3-flash-preview`) for all AI features
- Email/password + Google sign-in

## Design direction
- Palette: deep blue `#1e40af` primary, sky `#3b82f6` accent, white surfaces, slate text
- Fonts: Outfit (display) + Figtree (body) via @fontsource
- Modern cards with soft shadows, rounded-2xl, lucide icons, subtle gradients, Framer Motion fades

## Routes (`src/routes/`)
1. `index.tsx` — Home: hero, programme highlights, community blurb, sponsors strip, CTA
2. `about.tsx` — Programme overview, locations, age requirements, required documents, course duration, courses offered, lecturer profiles
3. `eligibility.tsx` — AI Eligibility Checker (age, education, province, documents → AI verdict)
4. `advisor.tsx` — AI Course Advisor (interests/goals → recommended beginner courses)
5. `apply.tsx` — AI Application Assistant (form + AI completeness check) — **protected**, saves to DB
6. `cv-builder.tsx` — AI CV Builder — **protected**, saves CV, download as text/PDF-printable HTML
7. `cover-letter.tsx` — AI Cover Letter Generator — **protected**, saves output
8. `contact.tsx` — Contact info, embedded Google Map (iframe), email/phone, FAQ accordion
9. `auth.tsx` — Sign in / sign up (email + Google)
10. `_authenticated/dashboard.tsx` — User's saved applications, CVs, cover letters

Shared `Header` (nav) + `Footer` in `__root.tsx`. Each route has its own SEO `head()`.

## Database (Lovable Cloud)
Tables (RLS scoped to `auth.uid()`):
- `profiles` (id, full_name, created_at) — auto-created via trigger
- `applications` (id, user_id, payload jsonb, ai_feedback text, status, created_at)
- `cvs` (id, user_id, content jsonb, generated_text text, created_at)
- `cover_letters` (id, user_id, target_role text, content text, created_at)

Each table gets standard GRANTs + RLS policies (owner-only select/insert/update/delete).

## AI server functions (`src/lib/ai.functions.ts`)
Public (no auth):
- `checkEligibility({ age, education, province, documents })`
- `recommendCourses({ interests, goals })`

Authenticated (`requireSupabaseAuth`, saves to DB):
- `reviewApplication({ formData })` → returns issues + suggestions, persists draft
- `generateCV({ personalInfo, education, skills, experience })` → persists CV
- `generateCoverLetter({ cvId | inline info, role, company })` → persists letter

All use the shared `createLovableAiGatewayProvider` helper in `src/lib/ai-gateway.server.ts`. Structured outputs via `Output.object` + Zod schemas.

## Auth gate
Use the integration-managed `_authenticated/route.tsx`. Public routes (home, about, eligibility, advisor, contact) work without sign-in. Apply/CV/Cover Letter/Dashboard require login — inline "Sign in to save" CTA when unauthenticated on apply/CV/cover-letter pages, or redirect to `/auth`.

## Content
Placeholder Gauteng-flavoured content (Johannesburg, Pretoria, Soweto venues; sample lecturer bios; sponsor logos as styled text cards) — clearly editable.

## Out of scope (v1)
- Real PDF export (use print-friendly HTML view)
- Admin dashboard
- Payments
- SMS notifications

## Verification
- Build passes
- Each AI flow exercised once (eligibility, advisor, CV) via preview
- Auth flow: sign up → save application → reload dashboard shows it
