# Project Pipeline — Agent Orchestration

> Turns a project idea into a researched spec, a clickable mockup, a narrated script and a finished demo video, using five subagents run in sequence by one orchestrator.

```
                ┌──────────────────────────────────────────────────────────┐
                │                      ORCHESTRATOR                        │
                │  owns the run folder, runs each stage, checks each gate, │
                │  sends work back on failure, asks the user at checkpoints│
                └──────────────────────────────────────────────────────────┘
                     │            │             │             │            │
                     ▼            ▼             ▼             ▼            ▼
              ┌──────────┐ ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐
  brief.md ──▶│ 1 RESEARCH│▶│ 2 SPEC   │─▶│ 3 MOCKUP │─▶│ 4 SCRIPT │▶│ 5 VIDEO  │──▶ demo.mp4
              └──────────┘ └──────────┘  └──────────┘  └──────────┘ └──────────┘
               research.md   spec.md       mockup/        transcript.md  video/
                             flows.json    screens.json   scenes.json    demo.mp4
```

---

## 1. Core principles

1. **Files are the handoff.** Agents never pass work through chat. Each stage reads the previous stage's files from the run folder and writes its own. The orchestrator only passes file paths.
2. **One shared ID system keeps everything in sync.** The spec defines IDs. Every later stage reuses them; none invents new ones.
   | ID | Defined by | Example | Used by |
   |---|---|---|---|
   | Flow | Spec | `F2` | Mockup, Script, Video |
   | Step | Spec | `F2.S3` | Mockup, Script, Video |
   | Screen | Spec (named), Mockup (built) | `SCR-checkout` | Script, Video |
   | Element | Mockup | `SCR-checkout#pay-btn` | Script, Video |
   | Scene | Script | `SC-07` | Video |
3. **Each stage has a gate.** The orchestrator checks the stage's output against its checklist before moving on. A failing stage is re-run with the failures listed (at most 2 retries, then ask the user).
4. **Upstream is the source of truth.** If a later agent finds a gap upstream (for example, the script needs a screen the spec never defined), it does not fill the gap itself. It writes the gap to `issues.md`, and the orchestrator re-runs the stage that owns it.
5. **The user signs off twice:** after the spec (scope) and after the mockup (look). The script and video are cheap to redo; the spec and mockup are not.

---

## 2. Run folder layout

One folder per project run:

```
project-pipeline/runs/<project-slug>/
├── brief.md                 # input: what the user asked for
├── state.json               # orchestrator state (stage, status, retries)
├── issues.md                # cross-stage gaps, filled by any agent
├── 01-research/
│   ├── research.md
│   └── sources.md
├── 02-spec/
│   ├── spec.md
│   └── flows.json           # machine-readable flows / steps / screens
├── 03-mockup/
│   ├── index.html           # clickable prototype (or one HTML per screen)
│   ├── assets/
│   ├── screens.json         # screen + element registry
│   └── screenshots/         # one PNG per screen, for review
├── 04-script/
│   ├── transcript.md        # human-readable script
│   └── scenes.json          # scene timeline the video agent executes
└── 05-video/
    ├── voiceover/           # one audio file per scene (if TTS is used)
    ├── captures/            # raw screen recordings per scene
    ├── captions.srt
    └── demo.mp4             # final output
```

### `state.json`

```json
{
  "project": "smart-attendance",
  "created": "2026-10-19",
  "current_stage": 3,
  "stages": {
    "1-research": { "status": "passed", "attempts": 1 },
    "2-spec":     { "status": "approved", "attempts": 1, "approved_by_user": true },
    "3-mockup":   { "status": "in_progress", "attempts": 2, "last_failures": ["SCR-settings missing empty state"] },
    "4-script":   { "status": "pending", "attempts": 0 },
    "5-video":    { "status": "pending", "attempts": 0 }
  }
}
```

Statuses: `pending → in_progress → passed → approved` (approved only for checkpoint stages), or `failed` / `blocked`.

---

## 3. The input brief

The orchestrator starts by writing `brief.md` from what the user said, then asks only for what's missing:

```markdown
# Brief: <project name>
- **Problem / idea:** one or two sentences
- **Target users:** who uses it
- **Platform:** web / mobile / desktop
- **Audience for the video:** recruiters, stakeholders, end users, investors…
- **Video length:** target in seconds (default 90–120s)
- **Tone:** e.g. confident and plain-spoken
- **Visual style / brand:** colours, fonts, references (optional)
- **Must include:** features or points that must appear
- **Out of scope:** what to leave out
```

---

## 4. Stages

Each stage lists: **role · reads · writes · instructions · gate**.

### Stage 1 — Research agent

**Role:** Understand the problem space well enough that the spec is grounded in real users, real competitors and real constraints.

**Reads:** `brief.md`
**Writes:** `01-research/research.md`, `01-research/sources.md`

**Instructions**
- Research the problem, the target users and their pain points, and how they solve it today.
- Find 3–5 existing products or competitors. For each: what they do well, where they fall short, and pricing or positioning if relevant.
- Note domain constraints: regulations, platform rules, accessibility, data privacy, technical limits.
- Collect proven UX patterns used for this kind of product.
- End with **Opportunities**: 3–6 concrete openings the product could take, each tied to evidence above.
- Cite every factual claim in `sources.md` (URL + one-line note). Mark anything unverified as an assumption.

**`research.md` structure**
```
# Research: <project>
## Problem summary
## Users & pain points        (persona sketches, jobs to be done)
## Current alternatives        (table: product | strengths | gaps)
## Constraints
## UX patterns worth reusing
## Opportunities               (numbered O1, O2… — the spec links to these)
## Open questions
## Assumptions
```

**Gate**
- [ ] At least 3 alternatives compared
- [ ] Every opportunity points to evidence in the doc
- [ ] Claims have sources, or are marked as assumptions
- [ ] Open questions listed (an empty list is allowed, but must be stated)

---

### Stage 2 — Spec agent

**Role:** Turn the research into a product spec: what it does, for whom, through which flows, on which screens.

**Reads:** `brief.md`, `01-research/research.md`
**Writes:** `02-spec/spec.md`, `02-spec/flows.json`

**Instructions**
- Define the problem statement, goals, non-goals and success metrics.
- Write personas (reuse the research ones) and **use cases** as `UC1, UC2…`, each with actor, trigger, main path, alternate paths and the outcome.
- List **key functionalities** with priority (P0 must-have / P1 / P2), each linked to a use case and a research opportunity (`O#`).
- Define **user flows** as `F1, F2…`, broken into steps `F1.S1, F1.S2…`. Each step names the screen it happens on, the user's action and the system's response.
- Name every screen (`SCR-<name>`) with its purpose, key content and states (default, empty, loading, error, success).
- Include a flow diagram per flow in Mermaid.
- Mark one flow as the **hero flow**: the one the video centres on.
- Keep `flows.json` in exact sync with `spec.md`.

**`spec.md` structure**
```
# Spec: <project>
## Problem statement
## Goals / Non-goals
## Success metrics
## Personas
## Use cases                   (UC1…)
## Key functionalities         (table: ID | feature | priority | UC | opportunity)
## User flows                  (F1… with Mermaid diagram + step table)
## Screen inventory            (SCR-… with purpose, content, states)
## Edge cases & error handling
## Open questions
```

**`flows.json`**
```json
{
  "hero_flow": "F1",
  "screens": [
    { "id": "SCR-home", "purpose": "Overview of today", "states": ["default", "empty"] }
  ],
  "flows": [
    {
      "id": "F1",
      "name": "Mark attendance",
      "use_cases": ["UC1"],
      "steps": [
        { "id": "F1.S1", "screen": "SCR-home", "user_action": "Taps 'Check in'", "system_response": "Opens camera" }
      ]
    }
  ]
}
```

**Gate**
- [ ] Every P0 feature appears in at least one flow
- [ ] Every flow step names a screen that exists in the inventory
- [ ] Every screen is used by at least one flow step
- [ ] A hero flow is marked
- [ ] `flows.json` parses and matches `spec.md`

**🛑 Checkpoint — user approves the spec.** The orchestrator shows the use cases, P0 features, flow diagrams and screen list, and waits for approval or changes.

---

### Stage 3 — Mockup agent

**Role:** Build a clickable, high-fidelity mockup of every screen in the spec, wired up so the hero flow can be clicked through end to end.

**Reads:** `02-spec/spec.md`, `02-spec/flows.json`, `brief.md` (style)
**Writes:** `03-mockup/index.html` (+ assets), `03-mockup/screens.json`, `03-mockup/screenshots/*.png`

**Instructions**
- Build in HTML/CSS (vanilla JS for interactions). Self-contained, no build step, so the video agent can open it directly in a headless browser.
- One screen per spec screen ID. Each screen's root element carries `data-screen="SCR-…"`.
- Every element the user interacts with in a flow step gets a stable ID: `data-el="pay-btn"`. These are what the video agent clicks and highlights.
- Make the flows navigable: clicking the element in step `F1.S1` leads to the screen in `F1.S2`.
- Support jumping to any screen and state via URL hash: `index.html#SCR-checkout?state=error`. The video agent relies on this.
- Use realistic sample content, not lorem ipsum.
- Build every state listed in the spec (empty, error, etc.).
- Use a fixed viewport matching the platform (e.g. 1440×900 for web, 390×844 for mobile) so recordings are consistent.
- Keep animations CSS-based and deterministic (no random timing), so recordings are repeatable.
- Take a screenshot of every screen and state.

**`screens.json`**
```json
{
  "viewport": { "width": 1440, "height": 900 },
  "entry": "index.html",
  "screens": [
    {
      "id": "SCR-home",
      "url": "index.html#SCR-home",
      "states": ["default", "empty"],
      "elements": [
        { "id": "checkin-btn", "selector": "[data-el='checkin-btn']", "label": "Check in button", "step": "F1.S1" }
      ]
    }
  ]
}
```

**Gate**
- [ ] Every spec screen and state exists and has a screenshot
- [ ] Hero flow clicks through end to end with no dead ends (checked in a headless browser)
- [ ] Every flow step's interactive element has a `data-el` and is in `screens.json`
- [ ] No console errors
- [ ] Text is readable at the recording viewport; contrast passes WCAG AA

**🛑 Checkpoint — user approves the mockup.** The orchestrator shares the screenshots (or a live preview) and waits for approval or changes.

---

### Stage 4 — Script agent

**Role:** Write the video narration and a scene-by-scene timeline that matches the mockup exactly.

**Reads:** `brief.md` (audience, length, tone), `02-spec/spec.md`, `02-spec/flows.json`, `03-mockup/screens.json`, `03-mockup/screenshots/`
**Writes:** `04-script/transcript.md`, `04-script/scenes.json`

**Instructions**
- Structure: **hook** (the problem, ~10%) → **context** (who it's for) → **walkthrough of the hero flow** (the bulk) → **1–2 supporting features** → **outcome / impact** → **close**.
- Write each scene to a single screen, and narrate only what is visible on that screen at that moment.
- Every on-screen action in a scene must reference a real element from `screens.json`.
- Time scenes by word count: ~150 words per minute (2.5 words/sec). Add 0.5–1s of breathing room per scene for transitions.
- Pick a transition for each scene change from this fixed set: `cut`, `fade`, `slide-left`, `slide-right`, `zoom-in`, `zoom-out`. Use `cut` within a flow and `fade` between sections.
- Total duration must land within ±10% of the brief's target.
- Write for speech: short sentences, no parentheses, no symbols the voice would read aloud.

**`transcript.md`** (for humans)
```markdown
| Scene | Time | Screen | On screen | Narration | Transition in |
|---|---|---|---|---|---|
| SC-01 | 0:00–0:08 | SCR-home (empty) | Slow zoom on empty dashboard | "Every morning, teams lose ten minutes to roll call." | fade |
| SC-02 | 0:08–0:15 | SCR-home | Cursor moves to Check in, clicks | "With one tap, check-in starts." | cut |
```

**`scenes.json`** (for the video agent — this is the contract)
```json
{
  "fps": 30,
  "viewport": { "width": 1440, "height": 900 },
  "total_duration_s": 96,
  "scenes": [
    {
      "id": "SC-02",
      "flow_step": "F1.S1",
      "screen": "SCR-home",
      "state": "default",
      "start_s": 8.0,
      "duration_s": 7.0,
      "transition_in": { "type": "cut", "duration_s": 0 },
      "narration": "With one tap, check-in starts.",
      "actions": [
        { "at_s": 1.0, "type": "move", "target": "checkin-btn" },
        { "at_s": 2.0, "type": "highlight", "target": "checkin-btn", "duration_s": 1.0 },
        { "at_s": 3.2, "type": "click", "target": "checkin-btn" }
      ],
      "camera": { "type": "zoom", "target": "checkin-btn", "scale": 1.3, "at_s": 1.5, "duration_s": 1.5 },
      "caption": "One tap to check in"
    }
  ]
}
```

Allowed action types: `move`, `click`, `type` (with `text`), `scroll` (with `to`), `hover`, `highlight`, `wait`. `at_s` is relative to the scene start.

**Gate**
- [ ] Every scene's `screen`, `state` and action `target`s exist in `screens.json`
- [ ] Every hero-flow step is covered by at least one scene, in order
- [ ] Scenes are contiguous (each `start_s` = previous `start_s + duration_s`)
- [ ] Narration fits each scene: words ÷ 2.5 ≤ `duration_s` − 0.5
- [ ] Every action fits inside its scene (`at_s` + its duration ≤ `duration_s`)
- [ ] Total length within ±10% of target
- [ ] `transcript.md` and `scenes.json` agree

---

### Stage 5 — Video agent

**Role:** Record the mockup following `scenes.json` exactly, add voiceover, transitions and captions, and export the final video.

**Reads:** `04-script/scenes.json`, `04-script/transcript.md`, `03-mockup/` (all), `03-mockup/screens.json`
**Writes:** `05-video/voiceover/`, `05-video/captures/`, `05-video/captions.srt`, `05-video/demo.mp4`

**Recommended toolchain**
| Job | Tool |
|---|---|
| Drive the mockup and record each scene | Playwright (headless Chromium, `recordVideo` at the scenes' viewport) |
| Cursor, highlight rings, zoom | Injected CSS/JS overlay in the page during recording |
| Voiceover | A TTS engine, one file per scene (or the user's own recorded audio) |
| Stitch, transitions, audio, captions | ffmpeg (`xfade` filter for transitions) — or Remotion if a React-based composition is preferred |

**Instructions**
1. **Voiceover first.** Generate one audio clip per scene. If a clip runs longer than its scene, extend the scene by the difference and shift every later scene — write the adjusted timings back to `05-video/scenes.final.json`. Never speed up the voice to fit.
2. **Record each scene separately.** For each scene: open `screens.json`'s URL for the scene's screen and state, wait for the page to settle, then run the actions at their `at_s` times. Resolve each `target` through `screens.json` to its selector. Record for exactly `duration_s`.
3. **Render the overlay** during recording: a visible cursor that moves smoothly to targets, a soft highlight ring for `highlight`, and CSS-transform zoom for `camera`.
4. **Stitch** the scene clips in order, applying each scene's `transition_in`.
5. **Lay the audio** so each voice clip starts at its scene's `start_s` (plus a 0.3s lead-in). Optional: background music at −20 dB, ducked under narration.
6. **Captions:** build `captions.srt` from narration and scene times; burn in only if the brief asks.
7. **Export** `demo.mp4`: H.264, AAC audio, the scenes' fps, viewport resolution (or 1080p scaled).

**Gate**
- [ ] Video duration matches `scenes.final.json` within 0.5s
- [ ] Every scene boundary lands on the right screen (check by grabbing a frame at each `start_s + 0.5s` and comparing it with the mockup screenshot)
- [ ] Every `click` produces the expected next screen in the recording
- [ ] No audio clipping or overlap between scenes
- [ ] Captions line up with speech

---

## 5. Orchestrator logic

```
start(brief):
  create run folder, write brief.md, state.json
  ask user for any missing brief fields

  for stage in [research, spec, mockup, script, video]:
    attempts = 0
    loop:
      run stage agent with: its role prompt + the input file paths + last_failures (if any)
      result = check gate(stage)
      if issues.md has new entries owned by an earlier stage:
          re-run that earlier stage, then every stage after it
      if result.passed:
          break
      attempts += 1
      if attempts > 2:
          mark stage blocked, show failures to user, wait for direction
    if stage in [spec, mockup]:
      show summary to user, wait for approval or change requests
      if changes: re-run stage with the user's notes as last_failures
    update state.json

  deliver: demo.mp4, transcript.md, spec.md, mockup link
```

### Re-run rules

| Change | Re-run from |
|---|---|
| New research / change of direction | Stage 1 |
| Scope change (add or remove a feature, flow or screen) | Stage 2 |
| Visual change only (colours, layout, copy on screen) | Stage 3 → regenerate screenshots, then Stage 4 gate check only (re-run Stage 4 if element IDs changed), then Stage 5 |
| Narration wording, pacing or length | Stage 4 |
| Transitions, music, captions, export settings | Stage 5 |

### Prompt template the orchestrator sends each agent

```
You are the <STAGE> agent in a five-stage project pipeline.

Project run folder: project-pipeline/runs/<slug>/
Read: <input file paths>
Write: <output file paths>

<the stage's Instructions section from this file>

Rules:
- Use only the IDs defined upstream (F#, F#.S#, SCR-…, element IDs). Do not invent new ones.
- If upstream is missing something you need, append it to issues.md as
  "- [<owning stage>] <what's missing> — needed for <your item>" and continue with what you have.
- Before finishing, check your output against this gate and report each item as pass/fail:
  <the stage's Gate checklist>

Previous attempt failed on (fix these first):
<last_failures or "n/a">
```

---

## 6. Running it in Claude Code

**Option A — one orchestrator session, stage subagents.** The five agents are defined in `.claude/agents/`. Tell the main session: *"Run the project pipeline in `project-pipeline/ORCHESTRATION.md` for `<brief>`."* The main session acts as the orchestrator and launches each stage with the Agent tool, one at a time, passing the run folder path and any `last_failures`.

| Stage | Agent (`subagent_type`) | Model | Tools |
|---|---|---|---|
| 1 Research | `pipeline-researcher` | sonnet | Read, Write, Edit, Glob, Grep, WebSearch, WebFetch |
| 2 Spec | `pipeline-spec-writer` | sonnet | Read, Write, Edit, Glob, Grep, Bash |
| 3 Mockup | `pipeline-mockup-builder` | opus | Read, Write, Edit, Glob, Grep, Bash (Playwright for click-through + screenshots) |
| 4 Script | `pipeline-script-writer` | sonnet | Read, Write, Edit, Glob, Grep, Bash |
| 5 Video | `pipeline-video-producer` | sonnet | Read, Write, Edit, Glob, Grep, Bash (Playwright, ffmpeg, TTS) |

Each agent reads this file for the shared rules, checks its own gate, and ends with a pass/fail report. The orchestrator still re-checks the gate before moving on.

**Option B — manual.** Run each stage yourself in order with the prompt template above, checking the gate between stages.

### Prerequisites for Stage 5
```bash
npm i -D playwright && npx playwright install chromium
```
```bash
brew install ffmpeg
```
Plus a TTS option (a hosted TTS API, or macOS `say` for drafts).

---

## 7. Final deliverables

| File | What it is |
|---|---|
| `01-research/research.md` | Market, users, competitors, opportunities |
| `02-spec/spec.md` | Use cases, features, flows, screens |
| `03-mockup/index.html` | Clickable prototype |
| `04-script/transcript.md` | Timed narration script |
| `05-video/demo.mp4` | Final narrated demo video |
| `05-video/captions.srt` | Captions |
