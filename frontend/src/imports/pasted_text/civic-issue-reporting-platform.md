# MASAIL — Master UI/UX Prompt (v2)
## Civic Issue Reporting Platform — Web + Mobile

> Paste this as one prompt. It's structured so the AI builds a *real, working-feeling product* — not a prototype with visible test controls, and not a single page trying to show everything at once.

---

## 0. Core Fixes From v1 (read this first)

1. **No role-switcher UI.** Role is determined by the logged-in account, never by a button the user clicks. After login, the system reads the account's role and routes automatically to that role's home page. There is no visible "select role: Admin / Officer / Resident" control anywhere in the real product — that only ever belongs in a hidden dev/QA tool, never on screen.
2. **One page = one job.** No dashboard should show more than 4–5 widgets. Every additional feature (issues list, campaigns, reports, uploads, settings) gets its **own page**, reached via sidebar/bottom-nav — not stacked underneath the dashboard.
3. **Progressive disclosure.** First-time and returning users should see a short, calm home screen with just: a greeting, 2–3 key stats, and clear next actions. Deeper data lives one tap/click away, not on the landing dashboard.
4. **Mobile is a first-class layout, not a squeezed desktop.** Build two explicit layouts per screen: Desktop (sidebar + top nav) and Mobile (bottom tab bar + FAB), not one responsive layout that just shrinks.
5. **All multi-step or long-running processes show a moving progress bar with a live percentage** (verification review, campaign funding, file uploads, project completion) — never a static spinner alone.

---

## 1. Design System

### Color Tokens (with tints, not single hex values)
| Role | Base | Light tint (bg/hover) | Dark mode |
|---|---|---|---|
| Primary — Deep Blue | `#2563EB` | `#EFF6FF` | `#3B82F6` |
| Secondary — Emerald | `#10B981` | `#ECFDF5` | `#34D399` |
| Accent — Amber | `#F59E0B` | `#FFFBEB` | `#FBBF24` |
| Danger | `#EF4444` | `#FEF2F2` | `#F87171` |
| Warning | `#F97316` | `#FFF7ED` | `#FB923C` |
| Background (light) | `#F8FAFC` | — | bg dark: `#0F172A` |
| Surface | `#FFFFFF` | — | surface dark: `#1E293B` |
| Text primary | `#1E293B` | — | text dark: `#F1F5F9` |
| Text secondary | `#64748B` | — | `#94A3B8` |

All pairs must meet WCAG AA contrast (4.5:1 body text).

### Typography
Inter (UI/body), Manrope for marketing headlines only.
Scale: `12 / 14 / 16 / 18 / 20 / 24 / 32 / 40` — never more than 3 sizes visible on one screen.

### Grid & Spacing
- Desktop: 12-col grid, 1280px max width, 24px gutter.
- Mobile: single column, 16px side padding, full-width cards.
- Spacing scale (8px base): `4, 8, 12, 16, 24, 32, 48`.
- Radius: `8px` inputs/chips, `12px` cards, `16px` modals.

### Icons
One set only — Lucide or Material Symbols Outlined, 24px, 1.5px stroke.

### The Process Tracker Component (new, required)
A reusable animated horizontal progress bar used everywhere something is "in motion":
- Filled bar animates left→right as status advances.
- Live percentage label (e.g. `Verification 60%`, `Campaign funded 72%`, `Uploading photo… 45%`).
- Color shifts with state: amber (in progress) → emerald (complete) → red (failed/rejected).
- Used for: file/photo uploads, verification review status, campaign funding threshold, project completion, multi-step forms (e.g. "Step 2 of 4 — 50%").

### Component States
Every interactive component needs: Default, Hover, Focus (visible ring), Active, Disabled, Loading, Error — for both desktop (mouse) and mobile (touch, no hover state — use active/pressed instead).

---

## 2. Site Map — Every Feature Gets Its Own Page

Do **not** combine these. Each is a separate screen/route.

**Public (before login)**
- `/` Landing page
- `/login` `/register` `/forgot-password`

**Shared app shell (after login — role-based home, no switcher)**
- `/home` — short overview: greeting, 2–3 stat cards, 2–3 quick actions, recent activity (max 5 items, "see all" link)
- `/issues` — full issue feed (its own page, with filters)
- `/issues/:id` — issue detail
- `/campaigns` — campaign feed
- `/campaigns/:id` — campaign detail with Process Tracker
- `/notifications`
- `/profile` and `/settings`
- `/search` — city → area → society drilldown, its own dedicated flow, not a widget

**Resident-only additions**
- `/report-issue` — the report form, its own full page (not a modal)
- `/my-issues` — status list with Process Tracker per issue
- `/verification` — upload documents, own page, with Process Tracker

**Verification Officer**
- `/review-queue` — queue list
- `/review-queue/:id` — single review screen (images, docs, approve/reject)

**Field Officer**
- `/assigned-projects`
- `/assigned-projects/:id/upload` — before/progress/after photo upload, own page, with Process Tracker per upload

**Super Admin** (each a full page, not a tab within one mega-dashboard)
- `/admin/overview` — top-level stats + charts only
- `/admin/users`
- `/admin/cities` `/admin/areas` `/admin/societies`
- `/admin/campaigns` `/admin/quotations`
- `/admin/reports`

---

## 3. Mobile-Specific UI Rules

- **Bottom tab bar**, max 5 icons (Home, Issues, Report [center, elevated FAB-style], Campaigns, Profile). Icons + labels, 48px min tap target.
- **Primary action = Floating Action Button** (e.g. "Report Issue") — thumb-reachable, bottom-right, always visible on home/issues pages.
- Cards stack full-width, single column, swipeable image galleries (not grid thumbnails).
- Forms: one field per row, large touch-friendly inputs (min 44px height), sticky "Continue" button at bottom of screen.
- No hover-dependent interactions — every hover-only desktop pattern needs a tap-equivalent (e.g. long-press or explicit "info" icon instead of tooltip-on-hover).
- Use native-feeling patterns: pull-to-refresh on feeds, bottom sheets instead of modals for quick actions.

## 4. Desktop-Specific UI Rules

- Persistent left sidebar (collapsible), top bar with global search + notifications + profile.
- Data tables allowed here (with sort/filter/pagination) where mobile would instead show cards.
- Hover states, tooltips, and multi-column layouts are fine — mobile drops these.

---

## 5. Landing Page (`/`)

Single scroll, in order: Hero (headline + Explore Issues / Login / Register) → Mission → How It Works (3-step visual) → Features → Before/After showcase → Live stats → Testimonials → FAQ → Footer.
Keep it to one page — this is the one place a longer scroll is appropriate, since it's meant to build trust before signup.

---

## 6. Authentication

Split-screen: form left, illustration/brand story right. Screens: Login, Register, Forgot Password, Google OAuth. Inline validation, password strength meter. On successful login, **route automatically** to the correct role home — no intermediate role-selection screen.

---

## 7. Key Flows — Show as Process Tracker, Not Prose

Each of these gets the animated percentage bar, not just a static stepper icon:

1. **Report Issue** → Step 1 of 4 (Details → Location → Photos → Review) with % complete.
2. **Get Verified** → Upload bill → Upload agreement (optional) → Pending review → Approved — bar fills as each stage completes.
3. **Issue Review** (officer side) → shows queue position + review progress.
4. **Campaign Funding** → live "% funded" bar on every campaign card and detail page.
5. **Project Completion** (field officer) → before/progress/after upload stages, each shows upload % while transferring, then overall project % complete.

---

## 8. Issue Detail Page (`/issues/:id`)

Cover image, title + category badge, location, reporter, status Process Tracker, support count + % funded bar, campaign info, contractor info, photo gallery (before/progress/after tabs), progress update feed, "Raise a Concern" button, related issues — kept on one page since it's a single record, not a feature list.

---

## 9. Admin Pages

Each of `/admin/users`, `/admin/cities`, `/admin/areas`, `/admin/societies`, `/admin/campaigns`, `/admin/quotations`, `/admin/reports` is a standalone page: searchable/filterable table (desktop) or card list (mobile), pagination, status chips, row actions, confirmation dialogs for destructive actions.

---

## 10. Quality Bar

- A first-time user should understand what to do within 5 seconds of landing on their home page — if a screen needs explaining, it has too much on it.
- No screen should require the user to scroll past more than ~3 sections to find their next action.
- Every long-running action (upload, review, funding, verification) must show live progress, never a bare "please wait."
- Build mobile and desktop as two intentional layouts, not one squeezed into the other.