# Doto

A minimal personal productivity app for daily focus. Each day is a clean slate — a short list of things that matter today, a backlog for everything else, and a view of what's coming up.

Built for one user. Password-protected with a 3-day session.

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

You'll need a Supabase project and a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
APP_PASSWORD=your-login-password
COOKIE_SECRET=your-64-char-hex-secret
```

Generate `COOKIE_SECRET` with:

```bash
openssl rand -hex 32
```

`APP_PASSWORD` is the password you'll type at the login screen. `COOKIE_SECRET` signs the session cookie — keep it private and don't change it while sessions are active (it will invalidate them).

Then run the schema from `SPEC.md` against your Supabase project to create the required tables (`day_todos`, `backlog_todos`, `plans`, `day_logs`).

---

## Design

Ultra-minimal. White cards, light gray background, serif page titles. No colored labels, no priorities, no categories. The only color accent is the green checkbox.

---

## Roadmap

A companion iOS app (Expo / React Native) is planned as Step 2, connecting to the same Supabase backend and adding push notifications and a home screen widget.
