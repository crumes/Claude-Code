# CLAUDE.md — Coach Progress Tracker

## Identity
- **Project:** Coach Progress Tracker — web app for personal trainers to log sessions and track client progress
- **Owner:** Sandra (founder/CEO)
- **Team:** Small: solo trainers to studios with 2–5 coaches
- **Focus:** Replace spreadsheets with a fast, intuitive dashboard. Get coaches from sign-up to logging their first session in under 10 minutes.

---

## Tech Stack

**Frontend:**
- Next.js 15+ (App Router)
- TypeScript
- React 19+
- Tailwind CSS
- Recharts (simple progress charts)

**Backend:**
- Next.js API routes / Server Actions
- Supabase (PostgreSQL, auth, row-level security)
- Node.js 20+

**Database:**
- Supabase PostgreSQL (managed)
- Tables: users, coaches, clients, sessions, metrics, studio_members

**Deployment:**
- Vercel (preferred)
- Environment variables via .env.local and Vercel platform settings

**Testing & Quality:**
- Jest (unit tests)
- Playwright (end-to-end tests)
- ESLint + Prettier
- TypeScript (strict mode)

---

## Always Do

- **Build modularly.** One feature per sprint. Test each module (auth, client CRUD, session logging, charts) before moving to the next. Don't integrate broken pieces.

- **Production-ready from day one.** No "we'll add security later." Auth is RLS (row-level security) in Supabase from the start. No hardcoded secrets. All env vars from the start.

- **Make it fast.** Target page load < 2 seconds, session log < 1 second. If something feels slow, profile it before shipping. Use caching and indexes.

- **Test the critical paths.** At minimum: login/sign-up, client create, session log, dashboard load. Don't ship untested flows.

- **Small, focused commits.** One feature or fix per commit. Write clear commit messages. Make it easy to revert if needed.

- **Ask before dependencies.** Every npm install needs a reason. Is it worth the bundle size and maintenance? If yes, explain why in the PR.

- **Mobile-responsive by default.** Test on iPad and mobile browser (iOS Safari, Chrome Android). Tablet/desktop first, but mobile must work.

- **Clear code > clever code.** A junior coach or developer should read your code and understand it in 5 minutes. No nested ternaries, no magic.

- **Database schema first.** Design the tables, keys, and RLS policies before touching React. Get the data model right.

---

## Never Do

- Hardcode API keys or secrets into the codebase. Use environment variables only (.env.local for dev, Vercel dashboard for prod).

- Commit .env files to git. .gitignore them always.

- Store sensitive data (passwords, payment info) in plain text. Use Supabase auth; never roll your own.

- Trust client-side data. Validate everything server-side (auth, permissions, data formats).

- Skip error handling. Every async function needs a try/catch or error boundary. Tell the user what went wrong, not "Error."

- Ship without testing in a browser on actual hardware (phone, tablet, desktop). Simulator ≠ real device.

- Use em dashes (—) in code comments or output. Use regular hyphens (-) or just break the sentence.

- Read .env files or print secrets to logs/console. If you need to debug auth, use Supabase dashboard tools, not console.log().

- Assume the database will always be fast. Add indexes for queries on client_id, user_id, session_date. Profile before and after.

---

## Security Rules

- **Auth:** Supabase JWT + RLS policies. No session cookies on the client. Verify token server-side for every API call.

- **Database:** RLS is mandatory. A coach can only see their own clients and sessions. A studio admin can see the studio's coaches and clients.

- **Environment variables:** All secrets (.env.local, API keys, database URL) live in environment only. Never in code.

- **Validation:** Sanitize and validate all form inputs (client names, exercise names, numbers for metrics). Prevent SQL injection and XSS.

- **HTTPS:** Enforced in production. Redirect HTTP to HTTPS.

- **Logging:** Don't log PII (client names, session details, passwords). Log errors with context but never secrets.

- **Rate limiting:** Add rate limits on sign-up and login (e.g., 5 attempts per minute) to prevent brute force.

---

## Communication Style

- **Tone:** Direct, practical, no corporate speak.
- **Length:** Concise yet detailed. Assume you're talking to a busy founder.
- **Depth:** Explain the high-level goal AND the technical "how" — don't pick one.
- **Special:**
  - I may go in circles or ask questions too early; redirect me back to the current sprint.
  - If a request doesn't align with the MVP scope, tell me and suggest when it fits better.
  - If you hit cognitive limits or need a break to hand off, say so immediately.

---

## MVP Scope (Hard Boundary)

### Week 1–3: Auth & Onboarding
- Coach sign-up / login
- Email verification
- Basic profile (name, email)
- Create studio workspace (optional for solo coaches)

### Week 4–5: Client Management
- Create / edit client profiles
- Add client goals and start date
- List clients assigned to coach
- Delete client (soft delete)

### Week 6–7: Session Logging & Metrics
- Log a workout session (date, exercise, sets/reps, notes)
- Add / edit performance metrics (weight, body measurements, strength benchmarks)
- Mark attendance (attended / missed / rescheduled)

### Week 8: Dashboard & Charts
- Client overview dashboard (last 4 weeks, attendance %)
- Simple line chart (weight trend, workout frequency)
- CSV export of sessions/metrics
- Deploy to Vercel

---

## File Structure

```
src/
  app/
    page.tsx                    # Landing / sign-up page
    dashboard/
      page.tsx                  # Coach dashboard
      clients/
        [id]/
          page.tsx              # Client detail + session log
    auth/
      login/
        page.tsx
      signup/
        page.tsx
  api/
    auth/
      signup.ts                 # Create user, send verification email
      login.ts                  # Authenticate, return JWT
    clients/
      route.ts                  # GET all clients, POST create
      [id]/
        route.ts                # GET, PATCH, DELETE client
    sessions/
      route.ts                  # POST new session, GET sessions for client
    metrics/
      route.ts                  # POST metric, GET metrics for client
  components/
    SessionForm.tsx
    MetricsChart.tsx
    ClientCard.tsx
  lib/
    supabase.ts                 # Supabase client config
    auth.ts                     # Helper functions for auth
    db.ts                       # Database queries (SELECT, INSERT, UPDATE)
  
public/                          # Static assets (logo, favicon)
.env.local                       # Dev environment variables (not in git)
.gitignore                       # Includes .env.local, node_modules, .next
package.json
tsconfig.json
next.config.js
```

---

## Testing & Deployment Checklist

Before shipping v1:
- [ ] Auth flows tested (sign-up, login, email verification, logout)
- [ ] RLS policies verified (coach can't see other coaches' clients)
- [ ] Session logging works end-to-end (form → database → dashboard)
- [ ] Charts render without errors (empty state, one data point, 100+ sessions)
- [ ] Mobile responsive (iPad, mobile Safari, Chrome Android)
- [ ] No console errors
- [ ] No secrets in logs or code
- [ ] Database indexes on user_id, client_id, session_date
- [ ] Error pages (404, 500) display clearly
- [ ] Documentation: how to run locally, how to deploy to Vercel

---

## Deployment & Environment

**Local Development:**
```bash
npm install
cp .env.example .env.local  # Fill in Supabase credentials
npm run dev                  # Next.js dev server on http://localhost:3000
```

**Production (Vercel):**
- Add environment variables to Vercel dashboard (SUPABASE_URL, SUPABASE_ANON_KEY, etc.)
- Push to main branch → Vercel auto-deploys
- Test staging first; get approval before prod

---

## Definition of Done

A feature is done when:
1. Code is written and tested (unit + e2e).
2. PR reviewed and approved.
3. RLS policies (if needed) are in place and tested.
4. Deployed to staging and tested in browser.
5. Secrets are in env vars, not hardcoded.
6. Documentation is updated.
7. Merged to main and deployed to production.

No "almost done" or "works on my machine." Ship or don't ship.
