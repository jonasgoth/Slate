# Slate

A minimal personal productivity app for daily focus. Each day is a clean slate — a short list of things that matter today, a backlog for everything else, and a view of what's coming up.

Built for one user. No auth, no complexity.

---

## What it does

**Today** — A daily focus list. Tasks stay in place when completed. At the start of each day, incomplete tasks from yesterday prompt you to clear them or move them to the backlog.

**Backlog** — A flat list of everything else. Push any item to Today with a single click.

**Plans** — Upcoming events with dates. Shows a countdown ("3 days", "Tomorrow") and a preview of the next few plans on the Today page.

---

## Tech stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** — all components built from scratch, no UI library
- **Supabase** — Postgres database with real-time subscriptions
- **framer-motion** — minimal use (delete transitions, hover reveals)
- **date-fns** — all date formatting and comparison

---

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You'll need a Supabase project. Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Then run the schema from `SPEC.md` against your Supabase project to create the required tables (`day_todos`, `backlog_todos`, `plans`, `day_logs`).

---

## Design

Ultra-minimal. White cards, light gray background, serif page titles. No colored labels, no priorities, no categories. The only color accent is the green checkbox.

---

## Roadmap

A companion iOS app (Expo / React Native) is planned as Step 2, connecting to the same Supabase backend and adding push notifications and a home screen widget.
