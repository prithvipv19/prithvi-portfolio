# Personal Website — Plan

> Living document. Edit freely; check off items as they're done.

## Goal
One site that presents my resume and a portfolio of my work: product/PM case studies, code projects, design work, writing and talks, and videos.

## Decisions
| Area | Choice | Why |
|---|---|---|
| Framework | **Astro** (static site) | Fast pages, content in Markdown, minimal JavaScript |
| Hosting | **GitHub Pages** | Free, redeploys automatically on every push |
| Resume source | Existing PDF/Word resume | Extract the content into structured data |
| Copy / voice | `copywriting-tone-of-voice-creator` skill | A consistent tone across the hero, about section and case studies |
| Domain | _TBD_: `<username>.github.io` or a custom domain | |

## Content model
Adding new work = adding one file. No code changes.

- **`src/content/work/*.md`**: one file per piece of work
  - Frontmatter fields: `title`, `summary`, `date`, `type` (`case-study | code | design | writing | video`), `tags[]`, `cover`, `featured`, `links` (`live`, `repo`, `figma`, `video`, `slides`), `role`, `impact`
  - Body: the full write-up (mainly for case studies)
- **`src/data/resume.yaml`**: basics, experience, education, skills, certifications
- **`public/resume.pdf`**: the downloadable resume

## Pages
| Route | Contents |
|---|---|
| `/` | Hero (name, one-line pitch, CTAs), featured work (3–4), short about, contact |
| `/work` | Grid of all work, filterable by type |
| `/work/[slug]` | Layout by type. Case study: problem → approach → outcome. Video: embedded player. Design: gallery. Code: repo and demo links |
| `/experience` | Work history timeline from `resume.yaml`; Skills, Education and Certifications as separate dropdowns; Download PDF button; print-friendly (`/resume` redirects here) |
| `/about` | Longer bio and photo (optional; could be merged into home) |

## Project structure
```
astro.config.mjs
src/
  content/config.ts        # collection schema
  content/work/*.md
  data/resume.yaml
  layouts/BaseLayout.astro
  components/              # Header, Footer, WorkCard, WorkFilter, VideoEmbed, Gallery, ResumeSection
  pages/                   # index, work/index, work/[slug], resume, about
  styles/global.css        # theme tokens, light/dark
public/                    # resume.pdf, images/, favicon
.github/workflows/deploy.yml
```

## Design principles
- **Professional yet approachable.** The fonts, formatting and wording should suit a product manager with a passion for building products: a confident, clean heading font paired with a warm, readable body font; plain, friendly wording instead of corporate jargon; and generous whitespace.
- **Works on every screen size.** Mobile (~360–480px), tablet (~768–1024px) and desktop (1280px+). Text scales fluidly, the work grid reflows 1 → 2 → 3 columns, the nav collapses into a menu on small screens, tap targets are at least 44px, and nothing scrolls sideways.
- Clean and typography-led, with one accent color and light/dark mode
- Accessible: semantic HTML, alt text, WCAG AA contrast, keyboard navigation
- Fast: minimal JavaScript, and videos load only on click
- SEO: page titles and meta tags, Open Graph image, sitemap

## Build steps
- [x] 1. Scaffold the Astro project and initialize git
- [x] 2. Define the content schema, layouts and pages (placeholder content)
- [ ] 3. Extract resume content from the PDF/Word file into `resume.yaml`
- [x] 4. Seed one sample entry per work type as templates
- [ ] 5. Define the tone of voice and write the hero, about and project copy
- [x] 6. Style and polish; check on mobile, tablet and desktop, and run an accessibility check
- [ ] 7. Set up GitHub Actions deploy to GitHub Pages (+ optional custom domain)

## Inputs needed
- [x] Resume file (docs/, git-ignored)
- [ ] List of projects to feature, with links, images and video URLs
- [ ] GitHub username / repo name, or a custom domain
- [x] Headshot (public/images/headshot.jpg)
- [ ] Accent color preference (optional)

## Verification
- `npm run dev`: click through every page, the work filter, a video embed and the resume page on mobile, tablet and desktop
- `npm run build` passes with no schema errors
- The `/resume` print preview looks clean
- After pushing, the deploy workflow passes and the live URL loads

## Open questions / notes
- **Design direction (Oct 2026 revamp):** light mode in lavender, mustard and white, with deep violet for weight. Hero = headshot in an arch over a mustard sun, focus-area chips, highlighted LinkedIn and email buttons. Proof strip ($6M ARR, 20+ devs and QA led, 6 launches, 20,000+ customers). Four work tiles. Career timeline: years along the bottom, one bar per company with its logo inside, thicker and deeper bars for longer stays, domain shown as a hover tooltip. Fonts: Bricolage Grotesque (headings) + Figtree (body). Icons: Tabler.
- **Where to edit content:** `src/data/resume.yaml` (experience, skills, education, certifications, intro, bio) and `src/content/work/*.md` (one file per project; copy a sample to add more). Gallery images go in `public/images/`; company logos in `public/logos/`. Hero stats, focus areas and timeline details (logo, domain, highlight) live in `resume.yaml`. Add `public/resume.pdf` and the Download PDF button appears.
- **Preview locally:** `npm run dev` → http://localhost:4321
- All copy is placeholder until the resume is in and the tone of voice is set (step 5).
