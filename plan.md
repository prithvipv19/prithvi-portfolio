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
- [ ] 6. Style and polish; check on mobile, tablet and desktop, and run an accessibility check
- [ ] 7. Set up GitHub Actions deploy to GitHub Pages (+ optional custom domain)

## Inputs needed
- [ ] Resume file (path: _TBD_)
- [ ] List of projects to feature, with links, images and video URLs
- [ ] GitHub username / repo name, or a custom domain
- [ ] Headshot (optional)
- [ ] Accent color preference (optional)

## Verification
- `npm run dev`: click through every page, the work filter, a video embed and the resume page on mobile, tablet and desktop
- `npm run build` passes with no schema errors
- The `/resume` print preview looks clean
- After pushing, the deploy workflow passes and the live URL loads

## Open questions / notes
- **Design direction:** typography-led and calm; the large hero headline carries the personality. (The "Right now" sticky note was removed at Prithvi's request.) Colors: cool off-white paper, deep ink text, teal links, sticky-note yellow accent. Fonts: Bricolage Grotesque (headings) + Atkinson Hyperlegible Next (body, chosen for readability).
- **Where to edit content:** `src/data/resume.yaml` (experience, skills, education, certifications, intro, bio) and `src/content/work/*.md` (one file per project; copy a sample to add more). Gallery images go in `public/images/`. Add `public/resume.pdf` and the Download PDF button appears.
- **Preview locally:** `npm run dev` → http://localhost:4321
- All copy is placeholder until the resume is in and the tone of voice is set (step 5).
