# Brief: Weight Loss Tracker — log food by photo, not by typing
- **Problem / idea:** Most weight-loss trackers make logging food the hard part, so people stop logging within a couple of weeks. Weight Loss Tracker is Prithvi's own mobile-first PWA (live at https://weight-loss-pwa.web.app/). It sets a daily calorie budget at onboarding (BMR, Mifflin-St Jeor), and logs meals, nutrition labels and scale readings from a photo using Gemini 2.5 Flash. Every AI result is a draft the person reviews and edits before it is saved. Water and activity are logged in a tap, and reports chart weight against calories in and out.
- **Target users:** Prithvi and people like him: busy adults trying to lose weight who have given up on manual calorie trackers. Secondary: an admin (super admin) who supports users and can "view as" a user, read-only.
- **Platform:** Mobile web / installable PWA (390×844).
- **Source of truth:** This is a REAL, shipped app, not a concept. The spec and mockup must describe and recreate what the app actually does. The app's source is at `/Users/prithvipv/Weight loss app/weight-loss-pwa/src` (pages/, styles/, utils/) and `/Users/prithvipv/Weight loss app/server/routes/`. **Read only. Never edit, run, build or deploy anything in that folder.** Real-app screenshots (taken locally on test data) are in `/Users/prithvipv/Documents/AI_Practice/Prithvi-resume-website/public/images/personal/weight-loss/` (onboarding, dashboard, capture-weight, log-meal, log-water, reports .jpg).
- **Research:** None for this run (a personal project). `01-research/research.md` is a short stub with the opportunities the product was built around.
- **Audience for the video:** Recruiters and hiring managers viewing Prithvi's portfolio. They want the product thinking and that he can build end to end, not a sales pitch.
- **Video length:** 36 seconds target. **Hard maximum 40 seconds.**
- **What the mockup is:** A faithful recreation of the real app's **hero flow only**, one screen per flow step, default state, wired so the flow clicks through. Not a working model: no real AI, no camera, no backend. Use a sample meal photo drawn in CSS/SVG or an inline illustration (no stock photos, no external image URLs).
- **What the video does:** Walk the hero flow screen by screen and, in the narration, say what the product does at each step (the functionality), not just what is clicked.
- **Tone:** Confident and plain-spoken. Short sentences. First person is fine ("I built…") only in the close.
- **Visual style / brand:** Match the real app in its dark "Night Training" theme with the yellow accent, as in the screenshots: background #0e0e0c, surfaces #1a1a14 / #212119, text #f3ede0, muted #a39c8c, border #30301f, accent yellow #f0a202 (≈ #e8a83a in screenshots), forest-to-yellow gradient for primary buttons and hero cards (#2d4a35 → #e8a83a), success green #7ad19b. Display font Bebas Neue (uppercase headings), body font Karla (Google Fonts). Cards 18px radius. Copy and labels must match the app (e.g. "Log Meal", "Step 1: Upload Photo", "Select or Take a Photo", "Capture Weight", "Snap a photo of your scale", "Reports", "Graph / Nutrition / Tabular / Meals", "Week / Month / Year").
- **Must include (functionality to show and narrate):**
  1. Onboarding sets the goal and works out a daily calorie budget from BMR.
  2. Log a meal from a photo: the AI suggests items, portions and nutrition (calories, protein, carbs, fat).
  3. Review and edit before saving: change a portion and the totals update; pick the meal time (morning, lunch, mid-afternoon, dinner).
  4. Today's calorie budget: eaten vs burned vs target.
  5. Capture weight from a photo of the scale; confirm the reading before it's logged.
  6. Reports: weight trend against calorie intake and calories burnt, by week, month or year.
- **Out of scope:** Sign-up/login screens, admin tools and view-as, nutrition-label scanning as its own screen, manual meal entry, profile settings, light theme, empty/loading/error states.
- **Data rule:** Fictional user "Alex", goal 78 kg, current ~85.7 kg, ~1,800 kcal budget. Sample meals: Greek yogurt & berries (morning), Chicken rice bowl (lunch), Apple & almonds (snack), Salmon, quinoa & greens (dinner). Date Tuesday, October 20.
- **Captions:** Generate captions.srt and a .vtt copy; do not burn in.
- **Voice:** macOS `say` is acceptable for this run (voice: Samantha, en_US), same as the Letters run.
