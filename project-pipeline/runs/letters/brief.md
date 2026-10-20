# Brief: Letters — HR letter generation, from template to signed letter
- **Problem / idea:** HR teams write offer, address-proof, experience and increment letters by hand in Word, chase signatures over email, and send PDFs one by one. Letters turns one reusable template into personalised, signed letters for one or many employees, routes them to the authorised signatory, and delivers them to the employee portal where the employee acknowledges them.
- **Target users:** HR admins (generate and release), authorised signatories such as the HR head (approve and sign), and employees (receive, download, accept or acknowledge).
- **Platform:** Web (1440×900)
- **Audience for the video:** Recruiters and hiring managers viewing Prithvi's product portfolio. They want the product thinking, not a sales pitch.
- **Video length:** 36 seconds target. **Hard maximum 40 seconds** (the final demo.mp4 must not exceed 40.0 s).
- **What the mockup is:** A mockup of the **hero flow only**: one screen per flow step, default state, wired so the flow clicks through. **Not a working model.** No extra states (empty, loading, error), no secondary flows, no real logic beyond moving to the next screen and simple visual toggles.
- **What the video does:** Walk the flow screen by screen and, in the narration, say what the product can do at each step (the functionality), not just what is being clicked.
- **Tone:** Confident and plain-spoken. Short sentences.
- **Visual style / brand:** Match the portfolio site: lavender and mustard on white. Lavender #f7f5fe / #eeeafb / #cfc6f5, violet #2b2160 for primary actions and headings, mustard #e5b53a for highlights, ink #1e1a33 text. Display font Bricolage Grotesque, body font Figtree (Google Fonts). Rounded cards (20px radius), pill buttons. Reference: `runs/overtime/03-mockup/index.html` for the house look.
- **Must include (functionality to show and narrate):**
  1. Template with merge fields (`${employeeName}`, `${designation}`, `${ctc}`…), a letter number series, and the setting for what the employee must do (acknowledge / accept or reject).
  2. Bulk generation: pick a template, an approval type, a signatory, and many employees by filter.
  3. Preview with each employee's real data merged in, then send for approval.
  4. Signatory approves and signs in their inbox (signature applied to the letter).
  5. Admin releases: publish to the employee portal, email as a password-protected PDF, require acceptance.
  6. Employee opens the letter in their document center and acknowledges it.
- **Out of scope:** Template upload / file round-trip, letter-request workflow by employees, multi-level reviewers, PFX certificate setup, mobile app, analytics, settings pages, real company names or greytHR branding.
- **Data rule:** All names, numbers and companies are fictional (NDA). Product name in the mockup: "Letters" (no vendor logo). Company: "Northwind Components Pvt Ltd".
- **Captions:** Generate captions.srt; do not burn in.
- **Voice:** macOS `say` is acceptable for this run (voice: Samantha, en_US).
