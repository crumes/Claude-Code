# Product Requirements Document (PRD)
## Coach Progress Tracker App

**Version:** 1.0  
**Date:** 2026-09-27  
**Status:** MVP Planning  
**Timeline:** 8 weeks (MVP) → 6 months (full product)

---

## Problem

Personal trainers and fitness coaches rely on spreadsheets, notebooks, or fragmented notes to track client progress. This manual workflow:
- Takes time away from coaching and client interaction
- Creates inconsistency and data loss
- Makes it impossible to quickly see trends or answer "How much stronger is my client?" in real time
- Doesn't scale when coaches add more clients

Coaches need a single, fast, reliable place to log sessions and visualize client progress at a glance.

---

## Goals

1. **Eliminate spreadsheets.** Replace manual tracking with a centralized web dashboard where coaches log sessions, attendance, and metrics in under 2 minutes per entry.

2. **Enable trend visibility.** Show coaches progress charts and summaries so they can demonstrate results to clients and adjust programs confidently.

3. **Support small teams.** Allow solo coaches and studios (2–5 coaches) to share client data, assign sessions, and collaborate without complex permissions.

4. **Drive adoption.** Make the app fast, intuitive, and immediately valuable so coaches use it daily within their first week.

5. **Scale from MVP to full product.** Build v1 with core tracking; add advanced features (integrations, AI insights, mobile app) in later phases.

---

## Target Users

**Primary:**
- Solo personal trainers (1 coach per studio)
- Small fitness studios (2–5 coaches, 20–100 active clients)
- Boutique coaching services (CrossFit boxes, yoga studios, strength coaches)

**Geographic:** US-based initially; English language.

**Tech comfort:** Comfortable with web apps; may not be highly technical.

**Pain point:** Currently tracking on paper, Excel, or phone notes. Want to save time and impress clients with data-driven insights.

---

## Scope

### In Scope (MVP, v1)

**Core Features:**
- Coach sign-up and login (email/password)
- Create and manage client profiles (name, goals, contact info, start date)
- Log workout sessions (date, exercise name, sets/reps, notes)
- Track performance metrics (weight, body measurements, strength benchmarks)
- Track attendance (mark sessions completed/missed)
- Client progress dashboard (show last 4 weeks of activity, attendance %)
- Simple charts (weight trend, workout frequency, attendance over time)
- Assign clients to coaches (small team support)
- Export session history as CSV

**Admin/Studio Features (for small teams):**
- Invite coaches to studio workspace
- View all clients across coaches (studio admin only)
- Basic role support (coach, studio admin)

**Performance & UX:**
- Mobile-responsive design (works on tablet, desktop; mobile view functional but not optimized)
- Fast load times (< 2 second page load)
- No external API dependencies for core features

---

### Out of Scope (v1)

- Native mobile apps (iOS/Android)
- Advanced analytics (ML-powered insights, predictive models)
- Video uploads or form check AI
- Integration with Fitbit, Apple Health, or wearables
- Payment processing or subscription management
- Social features (client leaderboards, peer challenges)
- Multi-language support
- On-premise deployment

---

## Success Criteria

**Adoption & Engagement:**
- MVP launched within 8 weeks
- First 10 coaches on-boarded and actively logging sessions by week 10
- Daily active coach rate ≥ 60% (coaches using the app at least 3 days/week)

**Usability:**
- Median time to log a session ≤ 2 minutes
- Mobile-responsive views render correctly on iPad and mobile browsers (tested on iOS Safari, Chrome Android)
- Zero blocking bugs on launch

**Data Integrity:**
- 100% session/client data persistence (no data loss)
- Session and metric data queryable within 500ms on average

**Product Quality:**
- Full test coverage on critical paths (login, session logging, dashboard)
- No hardcoded secrets in codebase
- Documentation for setup and deployment

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Coaches reluctant to switch from spreadsheets | Medium | High | Demo app with real use cases; onboard early adopters; fast, intuitive UX |
| Data privacy concerns (health/performance data) | Medium | High | Clear privacy policy; GDPR-ready data handling; encrypted storage; SOC 2 audit by v2 |
| Performance issues as client/session volume grows | Medium | High | Database indexing; caching strategy; load testing at 1000 clients/5000 sessions |
| Scope creep during MVP | High | Medium | Strict scope lock; document feature requests for v2; weekly sprint reviews |
| Small market size limits revenue | Low | Medium | Validate demand with interviews before launch; explore adjacent markets (nutritionists, physical therapists) |
| Competitor launches similar product | Low | Medium | Speed to market; strong UX differentiation; build community/loyalty early |
| Onboarding friction (coach learning curve) | Medium | Medium | In-app tutorial; video guides; responsive support; make defaults sensible |

---

## Open Questions

1. **Pricing model?** Freemium (core features free, studio/advanced features paid)? Monthly subscription? Per-coach seat?

2. **Data retention?** How long do we keep deleted client data? Archive policies?

3. **Performance metrics standardization?** Do we define a standard set of metrics (weight, bench press max, etc.) or let coaches customize?

4. **Authentication & security?** OAuth (Google, Apple sign-in) in v1 or email-only? HIPAA compliance required?

5. **Onboarding workflow?** Self-serve sign-up or invite-only for MVP? Demo account for trial?

6. **Client access?** Can clients see their own progress in v1, or coach-only view?

7. **Reporting & export?** Beyond CSV, do we need PDF workout programs or coach-to-client reports?

8. **Integrations roadmap?** What third-party integrations matter most (calendar, email, payment)?

---

## Next Steps

1. Validate with 5–10 target coaches (user interviews)
2. Design low-fidelity wireframes for core flows (login, client profile, session log, dashboard)
3. Finalize tech stack and database schema
4. Begin development sprint 1 (auth, client management, session logging)
