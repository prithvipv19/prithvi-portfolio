# Research: Sprout — houseplant watering tracker

## Problem summary
Watering is the main thing casual owners get wrong. University extension guidance names improper or inconsistent watering as the leading cause of houseplant trouble, covering both drowning plants and letting them dry out [1]. Too much water pushes oxygen out of the soil, so roots die and rot sets in [2], and gardening press calls overwatering the top killer: plants "killed with kindness" [3]. The root issue for someone with a handful of plants is memory: *when did I last water this one?* Sprout answers that question and shows which plants need water today.

## Users & pain points
**Persona: "Busy Maya" (assumption, built from the brief).** Late 20s, rents an apartment, owns 6 plants she got as gifts or impulse buys. She wants them alive but doesn't want a hobby.
- **Job to be done:** "When I walk past my plants, tell me which ones need water now, so I don't drown or forget any of them."
- **Pains:**
  - She can't remember which plant she watered or when, so she waters on a whim [1][3].
  - Full-featured apps feel like too much and hit her with paywalls early [4][5][9].
  - Fixed reminders nag her even after she watered early or late [6].
- **Today she solves it with:** memory, guessing, the finger-in-the-soil check [2], or a general care app.

## Current alternatives
| Product | Strengths | Gaps |
|---|---|---|
| **Planta** | Detailed per-plant care schedules. The free tier still sends watering reminders [5]. Snooze when soil isn't ready [7]. | Pricey, about $9.99/mo or $35.99/yr [4]. Smart reminders are behind the paywall [4]. Users report that reminders don't adjust after early or late watering [6]. Heavy for casual owners [5]. |
| **Greg** | Dynamic per-plant plans that factor in pot size, light and location [8]. | Paywall right after the onboarding quiz [9]. Asks for a lot of setup up front [9]. Price not verified (see Assumptions). |
| **Happy Plant** | Very simple: a plant is set up within minutes [11]. Watering streaks and snooze [10]. | Free tier caps at 3 plants [11]. A photo prompt on every watering adds friction [11]. No care guidance [11]. Coverage is dated [11]. |

## Constraints
- **Accessibility:** Touch targets must be at least 24×24 CSS px (WCAG 2.2 AA, SC 2.5.8). 44×44 is the stricter AAA target and the better fit for a one-tap primary action [12][13].
- **Platform:** Mobile web at 390×844, with no accounts or backend per the brief. Data therefore lives on the device (assumption: browser local storage).
- **No push backend (out of scope):** Sprout can't send reminders. The app has to be useful the moment it's opened, which puts the weight on the "today" list.
- **Privacy:** No sign-in and no data leaving the device keeps the privacy footprint minimal (assumption).

## UX patterns worth reusing
- **One list of what's due today:** apps like these centre on a per-plant schedule that surfaces what's due [4][10].
- **Logging resets the interval:** logging a watering should restart that plant's countdown. Users notice when it doesn't [6].
- **Snooze / "not yet":** respects the soil check without breaking the schedule [7][10].
- **Light, fast plant setup:** quick setup is what reviewers praised [11]. Avoid long quizzes before value appears [9].
- **Gentle motivation:** streaks give light, playful encouragement [10], which suits the brief's tone.

## Opportunities
- **O1. A "needs water today" home with nothing else in the way.** The core pain is forgetting when each plant was last watered [1][3]. Competitors bury this under care guides and paywalls [4][9].
- **O2. One-tap logging that resets the plant's countdown.** Users complain when reminders ignore early or late watering [6]. Logging-driven rescheduling is the expected pattern [6][10].
- **O3. Add a plant in seconds with only a name and an interval.** Quick setup wins praise [11]. Long quizzes and photo prompts add friction [9][11].
- **O4. Free and unlimited for 3–15 plants.** Rivals cap free plants [11] or paywall smart reminders [4][5]. Sprout's no-account scope makes "just free" credible.
- **O5. Guard against overwatering, not just underwatering.** Overwatering is a top killer [2][3], so a "not yet / check soil" nudge [7] helps as much as a reminder does.

## Open questions
- Should a plant's watering interval be set by the user, or come from a species preset? Presets add data work but make setup easier.
- Is a snooze or "check soil" action in scope given the brief's limit of 4 screens and 2 flows?
- How should Sprout show plants that are overdue by several days, as opposed to due today?

## Assumptions
- The "Busy Maya" persona is drawn from the brief's target users, not from interviews.
- Data is stored on the device (local storage), since accounts and backend are out of scope.
- Greg's price (about $29.99/yr with a 7-day trial, from a search summary of its App Store listing) could not be verified directly.
- Clarity's "~20% of feedback" figure [6] is a third-party estimate.
- The Happy Plant details [11] come from an older article and may be out of date.
