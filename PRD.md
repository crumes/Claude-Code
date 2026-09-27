# PRD — Video Agent

> A PRD says **what** we're building and **why**. It does not say how to code it.
> Fill in the brackets. Delete anything that doesn't apply — a short honest PRD beats
> a long aspirational one.

## Problem

[What's painful today? e.g. "Every promo video takes 3 hours in an editor, and changing
one price means redoing the whole thing."]

## What we're building

A code-driven video studio — an **agent** that lives in this folder. Briefs in plain
English go in; finished MP4s come out. Because the video is code, a change is an edit and
a re-render, not a rebuild.

**How it's put together:**

| Piece | Job |
|---|---|
| `CLAUDE.md` | Defines the agent — its role, rules and boundaries |
| `.claude/agents/video-planner.md` | Specialist: turns a rough idea into a shot plan |
| `.claude/skills/` | Remotion's manuals, read when relevant |
| No connectors (MCP) | Nothing external is needed to make video |

## Who it's for

- **Primary user:** [e.g. me, making weekly promos for my offers]
- **Skill level:** [e.g. comfortable in a terminal, not a video editor]

## Goals

| # | Goal | Done when |
|---|---|---|
| 1 | Turn a written brief into a finished MP4 | A 15s promo renders without hand-editing code |
| 2 | Restyle for a brand in one place | Changing one colour prop updates the whole video |
| 3 | Re-cut without starting over | Changing a line of copy is a re-render, not a rebuild |
| 4 | [your own] | [how you'll know] |

## In scope

- Motion graphics, kinetic typography, animated charts, promos, title cards
- Vertical (9:16), landscape (16:9) and square (1:1)
- Local rendering to MP4

## Out of scope

> Being explicit here is what stops a project sprawling.

- Talking-head or avatar video — that's a different tool
- Photoreal AI-generated footage — different tool
- Publishing or scheduling to social platforms
- Editing existing footage (this **generates**, it doesn't edit)

## Success criteria

- [ ] A brief becomes a rendered MP4 in under 10 minutes
- [ ] The same project re-renders identically tomorrow
- [ ] A brand change is one edit, not many
- [ ] Someone else can clone the folder and render it on their machine

## Constraints

- Renders locally — no cloud service, no upload
- Deterministic: no randomness, no wall-clock time, no timers
- Remotion is free for teams up to 3; larger companies need a licence
  (<https://www.remotion.pro/license>)

## Open questions

- [ ] Which brand(s) does this need to support?
- [ ] Do we need voiceover and captions, or visuals only?
- [ ] Standard length — 15s, 30s, 60s?

## Not doing yet (deliberately)

[Ideas parked on purpose. Writing them down stops them creeping into v1.]

- [e.g. multi-language versions]
- [e.g. rendering on a server instead of this laptop]
