# Video Agent

Videos built from code with [Remotion](https://www.remotion.dev), driven by Claude Code.

Describe the video you want in plain English; get back a finished MP4.

---

## Requirements

- **Node 18+** (`node --version`)
- ~500 MB free disk — a 113 MB headless browser downloads on first render
- Internet connection for the initial install

You do **not** need ffmpeg, a GPU, or a paid account.

---

## Setup

You shouldn't need to run these yourself — open Claude Code in this folder and say
*"Read CLAUDE.md and set this project up."* For reference, this is what it runs:

```bash
npm i
npx skills@latest add remotion-dev/skills --yes
```

The second command installs Remotion's 12 skills so Claude Code knows how to build and
render video. Confirm with `ls .claude/skills` — you should see 12 `remotion-*` folders.
No restart needed; Claude picks them up straight away.

> **Windows:** use exactly the command above. The alternative wrapper
> `npx remotion skills add` fails on Windows with `spawn EINVAL` — a CLI bug, not your
> machine. The command above is the one Remotion's own docs give, and works on every OS.

> **Note:** `skills` is an open-source installer from **Vercel Labs**, not Anthropic —
> Remotion's docs recommend it, but it's a third-party tool. The manual alternative is to
> download the repo and copy its skill folders into `.claude/skills/` yourself.

---

## Everyday use

```bash
npm run dev                                   # live preview in the browser
npx remotion compositions                     # list what can be rendered
npx remotion render MyComp out/video.mp4      # render to a file
```

With Claude Code, from inside this folder:

```bash
claude
```

Then just ask:

```
Make me a 15-second vertical promo for my coaching offer.
Bold headline, three benefits appearing one at a time, call to action at the end.
1080x1920, 30fps.
```

---

## Layout

```
my-video/
├── CLAUDE.md              rules Claude reads automatically every session
├── PRD.md                 what we're building and why
├── README.md              this file
├── src/                   your compositions (the video itself)
├── public/                images, audio, fonts — loaded with staticFile()
├── out/                   rendered MP4s
└── .claude/
    ├── agents/
    │   └── video-planner.md   specialist that turns rough ideas into shot plans
    └── skills/                the 12 Remotion skills
```

**Claude Code working in this folder is your video agent.** `CLAUDE.md` holds the standing
rules it reads at the start of every session; `video-planner` is a specialist it hands
planning work to; the skills are reference manuals it pulls up when relevant.

---

## The one rule that matters

**A video is a function of the frame number.** The same frame must always produce the
same pixels — that's what makes a render repeatable.

So inside a composition, never use `Math.random()`, `Date.now()`, `setTimeout`, or CSS
animations. All motion comes from `useCurrentFrame()`.

Break this and your video flickers differently on every render.

---

## When something breaks

| Problem | Fix |
|---|---|
| `spawn EINVAL` on Windows | Use `npx skills@latest add remotion-dev/skills --yes` |
| `.claude/skills` empty | Re-run the skills install **inside this folder** |
| `remotion: command not found` | `npm i` first |
| Stuck on "Getting Headless Shell" | It's a 113 MB one-time download — wait |
| Video looks different each render | Non-deterministic code — see the rule above |

---

## Licence note

Remotion is free for individuals and teams of up to 3. Larger companies need a paid
licence — <https://www.remotion.pro/license>
